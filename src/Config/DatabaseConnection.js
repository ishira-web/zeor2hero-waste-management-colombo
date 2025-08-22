import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../Model/user.model.js'; 
dotenv.config();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Database connected successfully');

    // --- ONE-TIME QUICK FIX: drop the wrong unique index ---
    try {
      await mongoose.connection.db
        .collection('users')               // collection name is lowercase plural
        .dropIndex('collectId_1');         // from your error message
      console.log('Dropped index collectId_1');
    } catch (e) {
      if (e?.codeName === 'IndexNotFound') {
        console.log('Index collectId_1 not found (already removed).');
      } else {
        console.warn('Could not drop index collectId_1:', e.message);
      }
    }
    // --- END OF ONE-TIME QUICK FIX ---
    await User.syncIndexes();

  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

export default connectDB;
