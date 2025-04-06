import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

console.log('API_KEY from env:', process.env.CLOUDINARY_API_KEY);

import { saveFileToCloudinary } from './saveFileToCloudinary.js';

const filePath = path.resolve('temp/photo-test.png');

const run = async () => {
  try {
    const result = await saveFileToCloudinary(filePath);
    console.log('✅ Файл успішно завантажено на Cloudinary!');
    console.log('🌐 URL:', result);
  } catch (err) {
    console.error('❌ Помилка при завантаженні:', err.message);
  }
};

run();
