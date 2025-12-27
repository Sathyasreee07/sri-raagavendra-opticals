import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/**
 * ADMIN DASHBOARD
 */
router.get("/dashboard", protect, admin, async (req, res) => {
  try {
    const timeframe = req.query.timeframe || "all";

    const data = {
      message: "Welcome to the admin dashboard",
      timeframe,
      stats: {
        totalUsers: 100,
        totalOrders: 50,
        totalSales: 25000,
      },
    };

    res.status(200).json(data);
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

/**
 * ADMIN PRODUCTS
 */
router.get("/products", protect, admin, async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      brand,
      priceRange,
      status,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (search) query.$text = { $search: search };
    if (category) query.category = category;
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (status) query.isActive = status === "active";

    if (priceRange) {
      const [min, max] = priceRange.split("-");
      query.price = {
        $gte: Number(min),
        $lte: max ? Number(max) : Infinity,
      };
    }

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      products,
      total,
      currentPage: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Admin product fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Admin product fetch error",
    });
  }
});

export default router;
