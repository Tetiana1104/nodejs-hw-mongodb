import path from 'path';

export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');

export const CLOUDINARY = {
  CLOUD_NAME: process.env['CLOUDINARY_CLOUD_NAME'],
  API_KEY: process.env['CLOUDINARY_API_KEY'],
  API_SECRET: process.env['CLOUDINARY_API_SECRET'],
};
