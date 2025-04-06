import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY } from '../constants/index.js';
import fs from 'fs/promises';

cloudinary.config({
  cloud_name: CLOUDINARY.CLOUD_NAME,
});

export const saveFileToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: 'contacts',
      upload_preset: 'contacts_unsigned',
    });

    await fs.unlink(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
