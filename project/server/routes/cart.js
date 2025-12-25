import express from 'express';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// This route is for server-side cart management, which is optional
// since we're already using client-side cart management
// Kept for future reference or extension

// @route   GET /api/cart
// @desc    Get user cart
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    res.json({
      message: 'Cart is managed on the client side'
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get cart'
    });
  }
});

export default router;