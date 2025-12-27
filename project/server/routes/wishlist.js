import express from "express";
import User from "../models/User.js";
import Product from "../models/Product.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   GET USER WISHLIST
============================ */
/**
 * @route   GET /api/wishlist
 * @desc    Get logged-in user's wishlist
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("wishlist")
      .select("wishlist");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      wishlist: user.wishlist,
    });
  } catch (error) {
    console.error("Get wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch wishlist",
    });
  }
});

/* ============================
   ADD TO WISHLIST
============================ */
/**
 * @route   POST /api/wishlist
 * @desc    Add product to wishlist
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent duplicates
    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(productId);
    await user.save();

    res.status(201).json({
      success: true,
      message: "Product added to wishlist",
    });
  } catch (error) {
    console.error("Add to wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product to wishlist",
    });
  }
});

/* ============================
   REMOVE FROM WISHLIST
============================ */
/**
 * @route   DELETE /api/wishlist/:id
 * @desc    Remove product from wishlist
 * @access  Private
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const productId = req.params.id;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const exists = user.wishlist.some(
      (id) => id.toString() === productId
    );

    if (!exists) {
      return res.status(400).json({
        success: false,
        message: "Product not in wishlist",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId
    );

    await user.save();

    res.json({
      success: true,
      message: "Product removed from wishlist",
    });
  } catch (error) {
    console.error("Remove wishlist error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to remove product from wishlist",
    });
  }
});

export default router;
