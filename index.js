import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const removeLegacyUserIndexes = async () => {
  try {
    const userIndexes = await User.collection.indexes();
    const hasLegacyEmailIndex = userIndexes.some((index) => index.name === 'email_1');

    if (hasLegacyEmailIndex) {
      await User.collection.dropIndex('email_1');
      console.log('Dropped legacy users.email_1 index.');
    }
  } catch (error) {
    console.error('Failed while checking or dropping legacy user indexes:', error.message);
  }
};

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('Successfully connected to MongoDB: viit-bus-verification');
    await removeLegacyUserIndexes();
  })
  .catch(err => console.error('MongoDB connection error:', err));

import authRoutes from './routes/auth.js';
import passRoutes from './routes/passes.js';
import scanRoutes from './routes/scans.js';

// Routes
app.get('/', (req, res) => {
  res.send('Bus Pass Verification System API is running...');
});

// Implementation required routes placeholder:
app.use('/api/auth', authRoutes);
app.use('/api/passes', passRoutes);
app.use('/api/scans', scanRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
