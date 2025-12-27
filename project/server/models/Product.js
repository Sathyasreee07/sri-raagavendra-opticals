import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    images: [
      {
        url: {
          type: String,
          required: true
        },
        alt: String
      }
    ],

    category: {
      type: String,
      required: true,
      enum: [
        "men",
        "women",
        "kids",
        "sunglasses-men",
        "sunglasses-women",
        "colored-lenses",
        "daily-lenses",
        "accessories"
      ],
      index: true
    },

    type: {
      type: String,
      required: true,
      enum: ["eyeglasses", "sunglasses", "contact-lenses", "accessories"],
      index: true
    },

    brand: {
      type: String,
      required: true,
      index: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true
    },

    isNew: {
      type: Boolean,
      default: false,
      index: true
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
        enum: ["Men", "Women", "Unisex", "Kids"]
      }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

/* ============================
   VIRTUAL: FINAL PRICE
============================ */
productSchema.virtual("finalPrice").get(function () {
  if (this.discount > 0) {
    return Math.round(this.price - (this.price * this.discount) / 100);
  }
  return this.price;
});

/* ============================
   SEARCH INDEX
============================ */
productSchema.index({
  name: "text",
  description: "text",
  brand: "text"
});

const Product = mongoose.model("Product", productSchema);

export default Product;
