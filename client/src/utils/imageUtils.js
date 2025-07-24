// Google Image utility functions
export const DEFAULT_AVATAR = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

/**
 * Fixes Google image URLs for better compatibility
 * @param {string} imageUrl - Original image URL
 * @param {number} size - Desired image size (default: 96)
 * @returns {string} - Fixed image URL
 */
export const fixGoogleImageUrl = (imageUrl, size = 96) => {
  if (!imageUrl) return DEFAULT_AVATAR;
  
  // If it's a Google image URL, ensure it has proper size parameter
  if (imageUrl.includes('googleusercontent.com')) {
    // Remove existing size parameters and add new one
    const baseUrl = imageUrl.split('=s')[0];
    return `${baseUrl}=s${size}-c`;
  }
  
  return imageUrl;
};

/**
 * Gets a safe image URL with fallback
 * @param {string} imageUrl - Original image URL
 * @param {number} size - Desired image size for Google images
 * @returns {string} - Safe image URL
 */
export const getSafeImageUrl = (imageUrl, size = 96) => {
  if (!imageUrl) return DEFAULT_AVATAR;
  
  try {
    return fixGoogleImageUrl(imageUrl, size);
  } catch (error) {
    console.warn('Error processing image URL:', error);
    return DEFAULT_AVATAR;
  }
};

/**
 * Image error handler for onError events
 * @param {Event} e - Error event
 */
export const handleImageError = (e) => {
  if (e.target.src !== DEFAULT_AVATAR) {
    e.target.src = DEFAULT_AVATAR;
  }
};

/**
 * Avatar props for Chakra UI Avatar components
 * @param {string} src - Image source URL
 * @param {number} size - Size for Google images
 * @returns {object} - Avatar props
 */
export const getAvatarProps = (src, size = 96) => ({
  src: getSafeImageUrl(src, size)
});
