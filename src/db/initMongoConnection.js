import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

dotenv.config();

const MONGO_URI = `mongodb+srv://tanyakorkh1104:${process.env.MONGODB_PASSWORD}@contacts-cluster.uofa3.mongodb.net/contactsDB?retryWrites=true&w=majority&appName=contacts-cluster`;

export async function initMongoConnection() {
  try {
    console.log('🟢 Connecting to MongoDB:', MONGO_URI);
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB connected successfully!');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}
export { User, Session };
