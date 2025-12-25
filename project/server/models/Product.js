import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
    maxlength: [100, 'Product name cannot be more than 100 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price must be positive']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot be more than 100%']
  },
  images: [{
    url: String,
    alt: String
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: ['men', 'women', 'kids', 'sunglasses-men', 'sunglasses-women', 'colored-lenses', 'daily-lenses', 'accessories']
  },
  type: {
    type: String,
    required: [true, 'Please provide product type'],
    enum: ['eyeglasses', 'sunglasses', 'contact-lenses', 'accessories']
  },
  brand: {
    type: String,
    required: [true, 'Please provide product brand']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isNew: {
    type: Boolean,
    default: false
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  specifications: {
    frameWidth: String,
    frameHeight: String,
    templeLength: String,
    bridgeWidth: String,
    frameMaterial: String,
    lensMaterial: String,
    weight: String,
    color: String,
    shape: String,
    gender: {
      type: String,
      enum: ['Men', 'Women', 'Unisex', 'Kids']
    }
  }
}, {
  timestamps: true
});

// Add text index for search functionality
productSchema.index({
  name: 'text',
  description: 'text',
  brand: 'text'
});

const Product = mongoose.model('Product', productSchema);

export default Product;
