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

  // Helper to extract URLs
  const extractUrls = (obj) => {
    if (!obj) return;
    if (typeof obj === 'string') {
      if (obj.includes('cloudinary.com') || obj.startsWith('http')) {
        urls.push(obj);
      }
    } else if (Array.isArray(obj)) {
      obj.forEach(extractUrls);
    } else if (typeof obj === 'object') {
      Object.values(obj).forEach(extractUrls);
    }
  };

  extractUrls(data);

  if (urls.length > 0) {
    try {
      // Mark all these URLs as permanent
      await UserImage.updateMany(
        { url: { $in: urls }, isTemporary: true },
        { $set: { isTemporary: false } }
      );
      console.log(`Finalized ${urls.length} images.`);
    } catch (err) {
      console.error('Failed to finalize images:', err);
    }
  }
}

/**
 * Deletes UserImage records where isTemporary: true and createdAt > 24 hours.
 * Also deletes corresponding assets from Cloudinary.
 */
export async function cleanupTemporaryImages() {
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  try {
    const imagesToDelete = await UserImage.find({
      isTemporary: true,
      createdAt: { $lt: twentyFourHoursAgo }
    });

    if (imagesToDelete.length === 0) return { deletedCount: 0 };

    // Delete from Cloudinary
    const publicIds = imagesToDelete.map(img => img.publicId).filter(id => id);
    
    if (publicIds.length > 0) {
      // Cloudinary delete_resources supports up to 100 at a time
      const chunks = [];
      for (let i = 0; i < publicIds.length; i += 100) {
        chunks.push(publicIds.slice(i, i + 100));
      }

      for (const chunk of chunks) {
        await cloudinary.api.delete_resources(chunk);
      }
    }

    // Delete from MongoDB
    const result = await UserImage.deleteMany({
      _id: { $in: imagesToDelete.map(img => img._id) }
    });

    console.log(`Cleaned up ${result.deletedCount} temporary images.`);
    return { deletedCount: result.deletedCount };
  } catch (err) {
    console.error('Cleanup Error:', err);
    return { error: err.message };
  }
}
