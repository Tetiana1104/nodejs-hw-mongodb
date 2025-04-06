import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'node:fs/promises';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  secure: true,
});

export const saveFileToCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.unsigned_upload(
      filePath,
      'contacts_unsigned',
    );

    await fs.unlink(filePath);
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};
