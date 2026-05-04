import UserImage from '@/models/UserImage';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Recursively scans an object for Cloudinary URLs that might be in the UserImage collection
 * and marks them as isTemporary: false.
 * @param {Object} data - The object to scan (e.g., customDesign object)
 */
export async function finalizeImagesInObject(data) {
  if (!data || typeof data !== 'object') return;

  const urls = [];
  const publicIds = [];

  // Helper to extract URLs and Public IDs
  const extractInfo = (obj) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (obj.includes('cloudinary.com') || obj.startsWith('http')) {
        urls.push(obj);
        
        // Extract publicId if it's a Cloudinary URL
        if (obj.includes('cloudinary.com')) {
          try {
            const parts = obj.split('/');
            const uploadIndex = parts.indexOf('upload');
            if (uploadIndex !== -1 && parts.length > uploadIndex + 2) {
              // Usually: .../upload/v12345678/folder/id.ext or .../upload/folder/id.ext
              let idParts = parts.slice(uploadIndex + 1);
              // Remove version (v12345678) if present
              if (idParts[0].startsWith('v') && !isNaN(idParts[0].substring(1))) {
                idParts = idParts.slice(1);
              }
              // Remove extension
              const lastPart = idParts[idParts.length - 1];
              const dotIndex = lastPart.lastIndexOf('.');
              if (dotIndex !== -1) {
                idParts[idParts.length - 1] = lastPart.substring(0, dotIndex);
              }
              publicIds.push(idParts.join('/'));
            }
          } catch (e) {
            console.error('Failed to extract publicId from URL:', obj);
          }
        }
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(extractInfo);
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(extractInfo);
    }
  };

  extractInfo(data);

  if (urls.length > 0 || publicIds.length > 0) {
    try {
      // Mark all these images as permanent by matching URL OR publicId
      const result = await UserImage.updateMany(
        { 
          $or: [
            { url: { $in: urls } },
            { publicId: { $in: publicIds } }
          ],
          isTemporary: true 
        },
        { $set: { isTemporary: false } }
      );
      if (result.modifiedCount > 0) {
        console.log(`Finalized ${result.modifiedCount} images.`);
      }
    } catch (err) {
      console.error('Failed to finalize images:', err);
    }
  }
}

/**
 * DEPRECATED/DISABLED: Deletes UserImage records where isTemporary: true.
 * This has been disabled per user request to ensure no images are lost.
 */
export async function cleanupTemporaryImages() {
  console.log('[Cleanup] Cleanup is currently disabled.');
  return { deletedCount: 0, status: 'disabled' };
}

/**
 * Utility to optimize Cloudinary URLs with auto format and quality.
 * Also handles trimming and basic sanitization.
 */
export function getOptimizedImageUrl(url) {
  if (!url || typeof url !== 'string') return url;
  
  // Return trimmed URL without transformations to avoid 404s on restricted accounts
  return url.trim();
}
