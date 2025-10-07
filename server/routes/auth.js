import express from 'express';
import {
  register,
  login,
  getMe,
  updateProfile
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/me
// @desc    Get current logged in user
// @access  Private (requires token)
router.get('/me', protect, getMe);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private (requires token)
router.put('/profile', protect, updateProfile);

export default router;