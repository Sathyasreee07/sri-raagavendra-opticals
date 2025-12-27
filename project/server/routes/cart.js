import express from "express";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   CART ROUTES
   (Client-side managed cart)
============================ */

/**
 * @route   GET /api/cart
 * @desc    Cart handled on client side
 * @access  Private
 */
router.get("/", protect, async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Cart is managed on the client side",
      cart: [],
    });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
});

export default router;
