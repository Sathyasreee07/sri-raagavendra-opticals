import express from "express";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   CREATE ORDER
============================ */

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private
 */
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice = 0,
      shippingPrice = 0,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items provided",
      });
    }

    // Validate stock availability
    for (const item of orderItems) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product not found: ${item.product}`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} has only ${product.stock} items left`,
        });
      }
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice,
      status: "Processing",
    });

    // Reduce stock
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    const createdOrder = await order.save();

    res.status(201).json({
      success: true,
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
});

/* ============================
   USER ORDERS
============================ */

/**
 * @route   GET /api/orders/myorders
 * @desc    Get logged-in user's orders
 * @access  Private
 */
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
});

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      order.user._id.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get order",
    });
  }
});

/* ============================
   PAYMENT
============================ */

/**
 * @route   PUT /api/orders/:id/pay
 * @desc    Mark order as paid
 * @access  Private
 */
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Payment update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update payment",
    });
  }
});

/* ============================
   ADMIN ROUTES
============================ */

/**
 * @route   GET /api/orders
 * @desc    Get all orders
 * @access  Private/Admin
 */
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get orders",
    });
  }
});

/**
 * @route   PUT /api/orders/:id/deliver
 * @desc    Mark order as delivered
 * @access  Private/Admin
 */
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = "Delivered";
    order.trackingNumber = req.body.trackingNumber || order.trackingNumber;

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Deliver order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update delivery",
    });
  }
});

/**
 * @route   PUT /api/orders/:id/status
 * @desc    Update order status
 * @access  Private/Admin
 */
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === "Delivered") {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});

export default router;
