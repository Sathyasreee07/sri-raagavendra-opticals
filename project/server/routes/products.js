import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   CREATE PRODUCT (ADMIN)
============================ */
/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Private/Admin
 */
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      price,
      discount = 0,
      images = [],
      category,
      type,
      brand,
      stock,
      isActive = true,
      isFeatured = false,
      isNew = false,
      specifications = {},
    } = req.body;

    // Required fields validation
    if (!name || !slug || !description || !price || !category || !type || !brand || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check duplicate slug
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "Product with this slug already exists",
      });
    }

    const product = new Product({
      name,
      slug,
      description,
      price,
      discount,
      images,
      category,
      type,
      brand,
      stock,
      isActive,
      isFeatured,
      isNew,
      specifications,
    });

    const savedProduct = await product.save();

    res.status(201).json({
      success: true,
      product: savedProduct,
    });
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});

/* ============================
   GET PRODUCTS (PUBLIC)
============================ */
/**
 * @route   GET /api/products
 * @desc    Get all products with filters, sorting & pagination
 * @access  Public
 */
router.get("/", async (req, res) => {
  try {
    const {
      category,
      type,
      brand,
      isFeatured,
      isNew,
      sortBy,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isNew !== undefined) query.isNew = isNew === "true";

    let sortOption = {};

    switch (sortBy) {
      case "newest":
        sortOption.createdAt = -1;
        break;
      case "price-low":
        sortOption.price = 1;
        break;
      case "price-high":
        sortOption.price = -1;
        break;
      default:
        sortOption.createdAt = -1;
    }

    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    res.json({
      success: true,
      products,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

/* ============================
   GET SINGLE PRODUCT BY SLUG
============================ */
/**
 * @route   GET /api/products/:slug
 * @desc    Get product by slug
 * @access  Public
 */
router.get("/:slug", async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get product",
    });
  }
});

export default router;
