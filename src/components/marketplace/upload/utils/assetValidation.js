/**
 * Asset Validation Utilities
 * Provides validation functions for the upload wizard
 */

// Generate URL-friendly slug from title
export const generateSlug = (title) => {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, '') // Remove leading/trailing hyphens
    + '-' + Date.now(); // Add timestamp for uniqueness
};

// Validate URL format
export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate image URL
export const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;
  
  // Check if it looks like an image URL
  return /\.(jpg|jpeg|png|gif|webp|svg)(\?.*)?$/i.test(url) || 
         url.includes('imgur.com') || 
         url.includes('cloudinary.com') ||
         url.includes('unsplash.com') ||
         url.includes('pexels.com') ||
         url.includes('images.') ||
         url.includes('/images/');
};

// Validate download URL (more permissive than image URLs)
export const isValidDownloadUrl = (url) => {
  if (!isValidUrl(url)) return false;
  
  // Allow common file hosting services
  return url.includes('drive.google.com') ||
         url.includes('dropbox.com') ||
         url.includes('onedrive.com') ||
         url.includes('github.com') ||
         url.includes('mediafire.com') ||
         url.includes('sendspace.com') ||
         /\.(zip|rar|pdf|psd|ai|sketch|html|js|ts|json|txt)(\?.*)?$/i.test(url);
};

// Validate asset data by step
export const validateAssetData = (assetData, stepId) => {
  const errors = {};
  
  switch (stepId) {
    case 'basic':
      // Title validation
      if (!assetData.title?.trim()) {
        errors.title = 'Title is required';
      } else if (assetData.title.length < 3) {
        errors.title = 'Title must be at least 3 characters';
      } else if (assetData.title.length > 100) {
        errors.title = 'Title must be less than 100 characters';
      }
      
      // Description validation
      if (!assetData.description?.trim()) {
        errors.description = 'Description is required';
      } else if (assetData.description.length < 20) {
        errors.description = 'Description must be at least 20 characters';
      } else if (assetData.description.length > 1000) {
        errors.description = 'Description must be less than 1000 characters';
      }
      
      // Asset type validation
      if (!assetData.asset_type) {
        errors.asset_type = 'Asset type must be selected';
      }
      
      // Price validation
      if (assetData.price < 0) {
        errors.price = 'Price cannot be negative';
      } else if (assetData.price > 999) {
        errors.price = 'Price cannot exceed $999';
      }
      break;
      
    case 'media':
      // Thumbnail validation (recommended but not required)
      if (assetData.thumbnail_url && !isValidImageUrl(assetData.thumbnail_url)) {
        errors.thumbnail_url = 'Please provide a valid image URL';
      }
      
      // Preview URL validation (optional)
      if (assetData.preview_url && !isValidUrl(assetData.preview_url)) {
        errors.preview_url = 'Please provide a valid URL';
      }
      
      // Gallery images validation (optional)
      if (assetData.gallery_image_urls && assetData.gallery_image_urls.length > 0) {
        const invalidUrls = assetData.gallery_image_urls.filter(url => !isValidImageUrl(url));
        if (invalidUrls.length > 0) {
          errors.gallery_image_urls = 'Some gallery image URLs are invalid';
        }
      }
      break;
      
    case 'files':
      // Download URL validation (required)
      if (!assetData.download_url?.trim()) {
        errors.download_url = 'Download URL is required';
      } else if (!isValidDownloadUrl(assetData.download_url)) {
        errors.download_url = 'Please provide a valid download URL';
      }
      
      // File size validation (optional)
      if (assetData.file_size_mb && (assetData.file_size_mb < 0.1 || assetData.file_size_mb > 1000)) {
        errors.file_size_mb = 'File size must be between 0.1 MB and 1000 MB';
      }
      break;
      
    case 'integration':
      // Integration fields are all optional, so minimal validation
      if (assetData.related_donation_project_id && 
          assetData.related_donation_project_id.trim() && 
          !isValidUrl(assetData.related_donation_project_id) && 
          !/^[a-f0-9-]{36}$/i.test(assetData.related_donation_project_id)) {
        errors.related_donation_project_id = 'Must be a valid URL or UUID';
      }
      break;
      
    case 'review':
      // Final validation - check all required fields
      const allErrors = [
        ...Object.values(validateAssetData(assetData, 'basic')),
        ...Object.values(validateAssetData(assetData, 'media')),
        ...Object.values(validateAssetData(assetData, 'files')),
        ...Object.values(validateAssetData(assetData, 'integration'))
      ];
      
      if (allErrors.length > 0) {
        errors.general = 'Please fix validation errors in previous steps';
      }
      break;
      
    default:
      break;
  }
  
  return errors;
};

// Get validation summary for display
export const getValidationSummary = (assetData) => {
  const allSteps = ['basic', 'media', 'files', 'integration'];
  let totalErrors = 0;
  const stepErrors = {};
  
  allSteps.forEach(stepId => {
    const errors = validateAssetData(assetData, stepId);
    stepErrors[stepId] = Object.keys(errors).length;
    totalErrors += Object.keys(errors).length;
  });
  
  return {
    totalErrors,
    stepErrors,
    isValid: totalErrors === 0
  };
};

// Sanitize asset data before submission
export const sanitizeAssetData = (assetData) => {
  return {
    ...assetData,
    title: assetData.title?.trim(),
    description: assetData.description?.trim(),
    thumbnail_url: assetData.thumbnail_url?.trim() || null,
    preview_url: assetData.preview_url?.trim() || null,
    download_url: assetData.download_url?.trim(),
    gallery_image_urls: assetData.gallery_image_urls?.filter(url => url?.trim()) || [],
    tags: assetData.tags?.filter(tag => tag?.trim()) || [],
    compatible_with: assetData.compatible_with?.filter(item => item?.trim()) || [],
    related_donation_project_id: assetData.related_donation_project_id?.trim() || null,
    related_collaboration_id: assetData.related_collaboration_id?.trim() || null,
    price: Math.max(0, Math.min(999, assetData.price || 0)),
    file_size_mb: assetData.file_size_mb ? Math.max(0.1, Math.min(1000, assetData.file_size_mb)) : null
  };
};