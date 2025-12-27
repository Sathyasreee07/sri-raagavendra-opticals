import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        image: { type: String, required: true },
        price: { type: Number, required: true, min: 0 },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true
        }
      }
    ],

    shippingAddress: {
      name: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "India" },
      phone: {
        type: String,
        required: true,
        validate: {
          validator: v =>
            /^(\+\d{1,3}[- ]?)?\d{10}$/.test(v),
          message: "Invalid phone number"
        }
      }
    },

    paymentMethod: {
      type: String,
      required: true,
      enum: ["CreditCard", "DebitCard", "NetBanking", "UPI", "Wallet", "COD"]
    },

    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String
    },

    taxPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    shippingPrice: {
      type: Number,
      default: 0,
      min: 0
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0
    },

    isPaid: {
      type: Boolean,
      default: false
    },

    paidAt: {
      type: Date
    },

    isDelivered: {
      type: Boolean,
      default: false
    },

    deliveredAt: {
      type: Date
    },

    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
      default: "Pending"
    },

    trackingNumber: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/* ============================
   INDEXES (ADMIN & PERFORMANCE)
============================ */
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ isPaid: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

export default Order;
