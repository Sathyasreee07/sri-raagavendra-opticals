import express from 'express';
import Product from '../models/Product.js';


const router = express.Router();

// POST /api/products - Create new product
router.post('/', async (req, res) => {
  try {
    const {
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
      specifications
    } = req.body;

    // Validate required fields (optional, mongoose will also validate)
    if (!name || !slug || !description || !price || !category || !type || !brand || stock == null) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if slug already exists to avoid duplicates
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({ message: 'Product with this slug already exists' });
    }

    // Create new product instance
    const newProduct = new Product({
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
      specifications
    });

    const savedProduct = await newProduct.save();
    return res.status(201).json(savedProduct);

  } catch (error) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
});
// GET /api/products - Get all products with optional filtering/sorting
// GET /api/products - Get all products with optional filtering and sorting
router.get("/", async (req, res) => {
  try {
    const { sortBy, category, type, brand, isFeatured, isNew } = req.query;

    const query = {};

    if (category) query.category = category;
    if (type) query.type = type;
    if (brand) query.brand = brand;
    if (isFeatured !== undefined) query.isFeatured = isFeatured === "true";
    if (isNew !== undefined) query.isNew = isNew === "true";

    let sortOption = {};

    if (sortBy === "newest") {
      sortOption.createdAt = -1;
    } else if (sortBy === "price-low") {
      sortOption.price = 1;
    } else if (sortBy === "price-high") {
      sortOption.price = -1;
    }

    const products = await Product.find(query).sort(sortOption);
    res.json(products);
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch products" });
  }
});

export default router;
