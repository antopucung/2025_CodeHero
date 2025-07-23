import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'digital_assets_data';

export const useDigitalAssets = () => {
  const [assets, setAssets] = useState([]);
  const [userPurchasedAssets, setUserPurchasedAssets] = useState([]);
  const [userDownloads, setUserDownloads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setUser(user);
      } catch (err) {
        if (err.message === 'Auth session missing!') {
          setUser(null);
          setError(null);
        } else {
          console.error('Error getting user:', err);
          setError(err.message);
        }
      }
    };
    
    getCurrentUser();
  }, []);

  // Fetch digital assets from Supabase
  const fetchDigitalAssets = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setAssets(data || []);
    } catch (err) {
      console.error('Error fetching digital assets:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user's purchased assets
  const fetchUserPurchasedAssets = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_purchased_assets')
        .select(`
          *,
          digital_assets (*)
        `)
        .eq('user_id', user.id)
        .order('purchase_date', { ascending: false });
      
      if (error) throw error;
      
      setUserPurchasedAssets(data || []);
    } catch (err) {
      console.error('Error fetching user purchased assets:', err);
      setError(err.message);
    }
  };

  // Fetch user's download history
  const fetchUserDownloads = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_asset_downloads')
        .select(`
          *,
          digital_assets (title, asset_type)
        `)
        .eq('user_id', user.id)
        .order('download_date', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      setUserDownloads(data || []);
    } catch (err) {
      console.error('Error fetching user downloads:', err);
      setError(err.message);
    }
  };

  // Load data when user changes
  useEffect(() => {
    fetchDigitalAssets();
    if (user) {
      fetchUserPurchasedAssets();
      fetchUserDownloads();
    } else {
      setUserPurchasedAssets([]);
      setUserDownloads([]);
    }
  }, [user]);

  // Create a new digital asset
  const createAsset = async (assetData) => {
    if (!user) {
      throw new Error('User must be logged in to create assets');
    }
    
    try {
      // Generate slug from title
      const slug = assetData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      const { data, error } = await supabase
        .from('digital_assets')
        .insert([{
          ...assetData,
          creator_id: user.id,
          slug: `${slug}-${Date.now()}` // Add timestamp to ensure uniqueness
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      // Award XP for asset upload
      const { data: xpResult, error: xpError } = await supabase.rpc('award_marketplace_xp', {
        p_user_id: user.id,
        p_event_type: 'asset_uploaded',
        p_reference_type: 'asset',
        p_reference_id: data.id,
        p_metadata: {
          asset_title: data.title,
          asset_type: data.asset_type,
          asset_price: data.price
        }
      });
      
      if (xpError) {
        console.error('Error awarding upload XP:', xpError);
      }
      
      // Refresh assets list
      await fetchDigitalAssets();
      
      return {
        success: true,
        asset: data,
        xpAwarded: xpResult?.[0]?.xp_awarded || 0,
        levelUp: xpResult?.[0]?.level_up || false,
        newLevel: xpResult?.[0]?.new_level
      };
    } catch (err) {
      console.error('Error creating asset:', err);
      throw err;
    }
  };

  // Update an existing digital asset
  const updateAsset = async (assetId, updates) => {
    if (!user) {
      throw new Error('User must be logged in to update assets');
    }
    
    try {
      const { data, error } = await supabase
        .from('digital_assets')
        .update(updates)
        .eq('id', assetId)
        .eq('creator_id', user.id) // Ensure only creator can update
        .select()
        .single();
      
      if (error) throw error;
      
      // Refresh assets list
      await fetchDigitalAssets();
      
      return {
        success: true,
        asset: data
      };
    } catch (err) {
      console.error('Error updating asset:', err);
      throw err;
    }
  };

  // Delete a digital asset
  const deleteAsset = async (assetId) => {
    if (!user) {
      throw new Error('User must be logged in to delete assets');
    }
    
    try {
      const { error } = await supabase
        .from('digital_assets')
        .delete()
        .eq('id', assetId)
        .eq('creator_id', user.id); // Ensure only creator can delete
      
      if (error) throw error;
      
      // Refresh assets list
      await fetchDigitalAssets();
      
      return { success: true };
    } catch (err) {
      console.error('Error deleting asset:', err);
      throw err;
    }
  };

  // Check if user owns an asset
  const doesUserOwnAsset = (assetId) => {
    return userPurchasedAssets.some(purchase => purchase.asset_id === assetId);
  };

  // Get asset by ID
  const getAssetById = (assetId) => {
    return assets.find(asset => asset.id === assetId);
  };

  // Get asset by slug
  const getAssetBySlug = (slug) => {
    return assets.find(asset => asset.slug === slug);
  };

  // Purchase an asset
  const purchaseAsset = async (assetId, stripeTransactionId, purchasePrice) => {
    if (!user) {
      throw new Error('User must be logged in to purchase assets');
    }
    
    try {
      // Record the purchase
      const { error: purchaseError } = await supabase
        .from('user_purchased_assets')
        .insert([{
          user_id: user.id,
          asset_id: assetId,
          stripe_transaction_id: stripeTransactionId,
          purchase_price: purchasePrice
        }]);
      
      if (purchaseError) throw purchaseError;
      
      // Award XP for asset purchase
      const { data: xpResult, error: xpError } = await supabase.rpc('award_marketplace_xp', {
        p_user_id: user.id,
        p_event_type: 'asset_purchased',
        p_reference_type: 'asset',
        p_reference_id: assetId,
        p_metadata: {
          purchase_price: purchasePrice,
          stripe_transaction_id: stripeTransactionId
        }
      });
      
      if (xpError) {
        console.error('Error awarding purchase XP:', xpError);
      }
      
      // Refresh user's purchased assets
      await fetchUserPurchasedAssets();
      
      return {
        success: true,
        xpAwarded: xpResult?.[0]?.xp_awarded || 0,
        levelUp: xpResult?.[0]?.level_up || false,
        newLevel: xpResult?.[0]?.new_level
      };
    } catch (err) {
      console.error('Error purchasing asset:', err);
      throw err;
    }
  };

  // Download an asset (records engagement)
  const downloadAsset = async (assetId) => {
    if (!user) {
      throw new Error('User must be logged in to download assets');
    }
    
    // Get the asset to check if it's free or if user owns it
    const asset = getAssetById(assetId);
    if (!asset) {
      throw new Error('Asset not found');
    }
    
    // Check if user can download (owns it or it's free)
    if (asset.price > 0 && !doesUserOwnAsset(assetId)) {
      throw new Error('User does not own this asset');
    }
    
    try {
      // Check if this is the first download
      const existingDownloads = userDownloads.filter(download => download.asset_id === assetId);
      const isFirstDownload = existingDownloads.length === 0;
      
      // Record the download
      const { error: downloadError } = await supabase
        .from('user_asset_downloads')
        .insert([{
          user_id: user.id,
          asset_id: assetId,
          download_count: 1
        }]);
      
      if (downloadError) throw downloadError;
      
      // Award XP for download (first time gets more XP)
      if (isFirstDownload) {
        const { data: xpResult, error: xpError } = await supabase.rpc('award_marketplace_xp', {
          p_user_id: user.id,
          p_event_type: 'asset_downloaded',
          p_reference_type: 'asset',
          p_reference_id: assetId,
          p_metadata: {
            first_download: true,
            asset_title: asset.title
          },
          p_custom_xp: 25 // First download bonus
        });
        
        if (xpError) {
          console.error('Error awarding download XP:', xpError);
        }
      } else {
        // Subsequent downloads get less XP (max 5 per day)
        const today = new Date().toDateString();
        const todayDownloads = existingDownloads.filter(
          download => new Date(download.download_date).toDateString() === today
        );
        
        if (todayDownloads.length < 5) {
          const { data: xpResult, error: xpError } = await supabase.rpc('award_marketplace_xp', {
            p_user_id: user.id,
            p_event_type: 'asset_downloaded',
            p_reference_type: 'asset',
            p_reference_id: assetId,
            p_metadata: {
              first_download: false,
              daily_download_count: todayDownloads.length + 1
            },
            p_custom_xp: 5 // Re-download XP
          });
          
          if (xpError) {
            console.error('Error awarding re-download XP:', xpError);
          }
        }
      }
      
      // Refresh download history
      await fetchUserDownloads();
      
      return {
        success: true,
        downloadUrl: asset.download_url,
        isFirstDownload
      };
    } catch (err) {
      console.error('Error downloading asset:', err);
      throw err;
    }
  };

  // Get user's asset statistics
  const getUserAssetStats = () => {
    return {
      totalPurchased: userPurchasedAssets.length,
      totalDownloads: userDownloads.length,
      assetTypes: userPurchasedAssets.reduce((acc, purchase) => {
        const assetType = purchase.digital_assets?.asset_type;
        if (assetType) {
          acc[assetType] = (acc[assetType] || 0) + 1;
        }
        return acc;
      }, {}),
      totalSpent: userPurchasedAssets.reduce((sum, purchase) => sum + (purchase.purchase_price || 0), 0),
      mostDownloadedAssets: userDownloads
        .reduce((acc, download) => {
          const assetId = download.asset_id;
          acc[assetId] = (acc[assetId] || 0) + 1;
          return acc;
        }, {}),
      recentActivity: userDownloads.slice(0, 10)
    };
  };

  // Get assets by type
  const getAssetsByType = (assetType) => {
    return assets.filter(asset => asset.asset_type === assetType);
  };

  // Get featured assets
  const getFeaturedAssets = (limit = 6) => {
    return assets
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  };

  // Get assets by creator
  const getAssetsByCreator = (creatorId) => {
    return assets.filter(asset => asset.creator_id === creatorId);
  };

  // Get user's created assets
  const getUserCreatedAssets = async () => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('digital_assets')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (err) {
      console.error('Error fetching user created assets:', err);
      return [];
    }
  };

  return {
    // State
    assets,
    userPurchasedAssets,
    userDownloads,
    loading,
    error,
    user,
    
    // Asset management (CRUD)
    createAsset,
    updateAsset,
    deleteAsset,
    
    // Asset queries
    getAssetById,
    getAssetBySlug,
    getAssetsByType,
    getAssetsByCreator,
    getFeaturedAssets,
    getUserCreatedAssets,
    doesUserOwnAsset,
    
    // User actions
    purchaseAsset,
    downloadAsset,
    
    // Statistics
    getUserAssetStats,
    
    // Data refresh
    refreshAssets: fetchDigitalAssets,
    refreshUserAssets: fetchUserPurchasedAssets,
    refreshDownloads: fetchUserDownloads
  };
};