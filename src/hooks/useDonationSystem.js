import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'donation_rewards_data';

export const useDonationSystem = () => {
  const [donationTiers, setDonationTiers] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_tiers`);
    return saved ? JSON.parse(saved) : [
      {
        id: 'bronze',
        name: 'Bronze',
        amount: 5,
        icon: '🥉',
        color: '#CD7F32',
        durationDays: 30,
        rewards: [
          'Access to basic tools library',
          'Preview of tutorials',
          'Community recognition badge'
        ]
      },
      {
        id: 'silver',
        name: 'Silver',
        amount: 15,
        icon: '🥈',
        color: '#C0C0C0',
        durationDays: 30,
        rewards: [
          'Access to intermediate tools library',
          'Full access to basic tutorials',
          'Project templates access',
          'Silver community badge'
        ]
      },
      {
        id: 'gold',
        name: 'Gold',
        amount: 30,
        icon: '🥇',
        color: '#FFD700',
        durationDays: 30,
        rewards: [
          'Access to premium tools library',
          'Full access to all tutorials',
          'Priority community support',
          'Gold community badge',
          'Monthly exclusive webinar'
        ]
      },
      {
        id: 'platinum',
        name: 'Platinum',
        amount: 50,
        icon: '💎',
        color: '#E5E4E2',
        durationDays: 30,
        rewards: [
          'Access to all tools and resources',
          'Early access to new content',
          'One-on-one mentoring session',
          'Platinum community badge',
          'Featured profile highlight',
          'Collaboration opportunities priority'
        ]
      }
    ];
  });

  const [userDonations, setUserDonations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : [];
  });

  const [projectDonations, setProjectDonations] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_projects`);
    return saved ? JSON.parse(saved) : [];
  });

  const [contentLibrary, setContentLibrary] = useState(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_content`);
    return saved ? JSON.parse(saved) : {
      tools: [],
      tutorials: []
    };
  });

  // Save state to local storage on change
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_tiers`, JSON.stringify(donationTiers));
  }, [donationTiers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_user`, JSON.stringify(userDonations));
  }, [userDonations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_projects`, JSON.stringify(projectDonations));
  }, [projectDonations]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_content`, JSON.stringify(contentLibrary));
  }, [contentLibrary]);

  // Process a donation and assign rewards
  const processDonation = async (donation) => {
    try {
      const { projectId, userId, amount, paymentMethod, message } = donation;
      
      // 1. Determine the tier based on amount
      const tier = determineTier(amount);
      
      // 2. Calculate expiration date (30 days from now)
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + tier.durationDays);
      
      // 3. Create a donation record
      const newDonation = {
        id: Date.now().toString(),
        projectId,
        userId: userId || 'current_user',
        amount,
        tier: tier.id,
        paymentMethod,
        message: message || '',
        timestamp: new Date().toISOString(),
        expirationDate: expirationDate.toISOString()
      };
      
      // 4. Update user donations
      setUserDonations(prev => [...prev, newDonation]);
      
      // 5. Update project donations
      setProjectDonations(prev => {
        // Find existing project record or create new one
        const existingProject = prev.find(p => p.projectId === projectId);
        
        if (existingProject) {
          // Update existing project
          return prev.map(p => p.projectId === projectId ? {
            ...p,
            totalAmount: p.totalAmount + amount,
            donationsCount: p.donationsCount + 1,
            lastDonation: new Date().toISOString()
          } : p);
        } else {
          // Add new project
          return [...prev, {
            projectId,
            totalAmount: amount,
            donationsCount: 1,
            lastDonation: new Date().toISOString()
          }];
        }
      });
      
      return { success: true, donation: newDonation };
    } catch (error) {
      console.error('Error processing donation:', error);
      return { success: false, error: error.message };
    }
  };

  // Determine tier based on donation amount
  const determineTier = (amount) => {
    // Sort tiers by amount (descending)
    const sortedTiers = [...donationTiers].sort((a, b) => b.amount - a.amount);
    
    // Find the highest tier that the amount qualifies for
    for (const tier of sortedTiers) {
      if (amount >= tier.amount) {
        return tier;
      }
    }
    
    // Default to lowest tier if no match
    return sortedTiers[sortedTiers.length - 1];
  };

  // Check if user has active rewards
  const hasActiveRewards = (userId = 'current_user', tierId = null) => {
    const now = new Date().toISOString();
    
    // Filter donations by user and check if any are active
    const activeDonations = userDonations.filter(donation => 
      donation.userId === userId && 
      donation.expirationDate > now && 
      (tierId ? donation.tier === tierId : true)
    );
    
    return activeDonations.length > 0;
  };

  // Get highest active tier for a user
  const getHighestActiveTier = (userId = 'current_user') => {
    const now = new Date().toISOString();
    
    // Filter active donations
    const activeDonations = userDonations.filter(donation => 
      donation.userId === userId && 
      donation.expirationDate > now
    );
    
    if (activeDonations.length === 0) return null;
    
    // Get tier IDs and find the highest one
    const tierIds = activeDonations.map(donation => donation.tier);
    const sortedTiers = [...donationTiers].sort((a, b) => b.amount - a.amount);
    
    for (const tier of sortedTiers) {
      if (tierIds.includes(tier.id)) {
        return tier;
      }
    }
    
    return null;
  };

  // Get project donation statistics
  const getProjectDonationStats = (projectId) => {
    const projectData = projectDonations.find(p => p.projectId === projectId);
    
    if (!projectData) {
      return { 
        totalAmount: 0,
        donationsCount: 0,
        lastDonation: null,
        topDonors: []
      };
    }
    
    // Get top donors for this project
    const projectUserDonations = userDonations
      .filter(d => d.projectId === projectId)
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);
      
    return {
      ...projectData,
      topDonors: projectUserDonations
    };
  };

  // Get user donation statistics
  const getUserDonationStats = (userId = 'current_user') => {
    const userDonationData = userDonations.filter(d => d.userId === userId);
    
    // Calculate total donated
    const totalDonated = userDonationData.reduce((sum, d) => sum + d.amount, 0);
    
    // Calculate active rewards
    const now = new Date().toISOString();
    const activeRewards = userDonationData
      .filter(d => d.expirationDate > now)
      .map(d => {
        const tier = donationTiers.find(t => t.id === d.tier);
        return {
          donation: d,
          tier,
          daysRemaining: Math.ceil((new Date(d.expirationDate) - new Date()) / (1000 * 60 * 60 * 24))
        };
      });
      
    return {
      totalDonated,
      donationsCount: userDonationData.length,
      activeRewards,
      donationHistory: userDonationData.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    };
  };

  // Add content to the library
  const addContent = (type, content) => {
    if (type !== 'tools' && type !== 'tutorials') {
      throw new Error('Invalid content type. Must be "tools" or "tutorials"');
    }
    
    setContentLibrary(prev => ({
      ...prev,
      [type]: [...prev[type], { ...content, id: Date.now().toString() }]
    }));
  };

  // Get accessible content based on user's tier
  const getAccessibleContent = (userId = 'current_user') => {
    const userTier = getHighestActiveTier(userId);
    const tierLevel = userTier ? donationTiers.findIndex(t => t.id === userTier.id) : -1;
    
    // Filter tools based on tier access level
    const accessibleTools = contentLibrary.tools.filter(tool => {
      const toolTierLevel = donationTiers.findIndex(t => t.id === tool.minTier);
      return tierLevel >= toolTierLevel;
    });
    
    // Filter tutorials based on tier access level
    const accessibleTutorials = contentLibrary.tutorials.filter(tutorial => {
      const tutorialTierLevel = donationTiers.findIndex(t => t.id === tutorial.minTier);
      return tierLevel >= tutorialTierLevel;
    });
    
    return {
      tools: accessibleTools,
      tutorials: accessibleTutorials,
      currentTier: userTier,
      hasActiveSubscription: tierLevel >= 0
    };
  };

  return {
    donationTiers,
    processDonation,
    hasActiveRewards,
    getHighestActiveTier,
    getProjectDonationStats,
    getUserDonationStats,
    contentLibrary,
    addContent,
    getAccessibleContent
  };
};