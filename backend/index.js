import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

import User from './models/User.js';
import Warranty from './models/Warranty.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/warranty_vault';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// MongoDB Connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

// --- AUTH ROUTES ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user details.' });
  }
});

// --- WARRANTY ROUTES (User Restricted) ---

// GET /api/warranties
app.get('/api/warranties', authMiddleware, async (req, res) => {
  try {
    const warranties = await Warranty.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(warranties);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching warranties.' });
  }
});

// POST /api/warranties
app.post('/api/warranties', authMiddleware, async (req, res) => {
  try {
    const { productName, brand, category, purchaseDate, warrantyExpiryDate, price, receiptUrl, notes } = req.body;

    if (!productName || !brand || !category || !purchaseDate || !warrantyExpiryDate || price === undefined) {
      return res.status(400).json({ message: 'Please fill all required fields.' });
    }

    const newWarranty = await Warranty.create({
      user: req.userId,
      productName,
      brand,
      category,
      purchaseDate,
      warrantyExpiryDate,
      price: Number(price),
      receiptUrl: receiptUrl || '',
      notes: notes || '',
    });

    res.status(201).json(newWarranty);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating warranty item.', error: error.message });
  }
});

// PUT /api/warranties/:id
app.put('/api/warranties/:id', authMiddleware, async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);

    if (!warranty) {
      return res.status(404).json({ message: 'Warranty record not found.' });
    }

    if (warranty.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this record.' });
    }

    const updatedWarranty = await Warranty.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedWarranty);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating warranty.' });
  }
});

// DELETE /api/warranties/:id
app.delete('/api/warranties/:id', authMiddleware, async (req, res) => {
  try {
    const warranty = await Warranty.findById(req.params.id);

    if (!warranty) {
      return res.status(404).json({ message: 'Warranty record not found.' });
    }

    if (warranty.user.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this record.' });
    }

    await Warranty.findByIdAndDelete(req.params.id);
    res.json({ message: 'Warranty deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting warranty.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server executing on http://localhost:${PORT}`);
});