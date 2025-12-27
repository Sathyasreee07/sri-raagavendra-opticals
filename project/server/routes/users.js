import express from "express";
import User from "../models/User.js";
import { protect, admin } from "../middleware/auth.js";

const router = express.Router();

/* ============================
   GET CURRENT USER
============================ */
/**
 * @route   GET /api/users/me
 * @desc    Get logged-in user profile
 * @access  Private
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get current user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user profile",
    });
  }
});

/* ============================
   UPDATE OWN PROFILE
============================ */
/**
 * @route   PUT /api/users/profile
 * @desc    Update logged-in user profile
 * @access  Private
 */
router.put("/profile", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Basic fields
    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;

    // Address update
    if (req.body.address) {
      user.address = {
        street: req.body.address.street ?? user.address?.street,
        city: req.body.address.city ?? user.address?.city,
        state: req.body.address.state ?? user.address?.state,
        postalCode: req.body.address.postalCode ?? user.address?.postalCode,
        country: req.body.address.country ?? user.address?.country ?? "India",
      };
    }

    // Password update
    if (req.body.password) {
      user.password = req.body.password; // hashed via model middleware
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

/* ============================
   ADMIN: GET ALL USERS
============================ */
/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Private/Admin
 */
router.get("/", protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
});

/* ============================
   ADMIN: GET USER BY ID
============================ */
/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID
 * @access  Private/Admin
 */
router.get("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user by ID error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
    });
  }
});

/* ============================
   ADMIN: UPDATE USER
============================ */
/**
 * @route   PUT /api/users/:id
 * @desc    Update user (admin)
 * @access  Private/Admin
 */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = req.body.name ?? user.name;
    user.email = req.body.email ?? user.email;
    user.phone = req.body.phone ?? user.phone;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    if (req.body.address) {
      user.address = {
        street: req.body.address.street ?? user.address?.street,
        city: req.body.address.city ?? user.address?.city,
        state: req.body.address.state ?? user.address?.state,
        postalCode: req.body.address.postalCode ?? user.address?.postalCode,
        country: req.body.address.country ?? user.address?.country ?? "India",
      };
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isAdmin: updatedUser.isAdmin,
      },
    });
  } catch (error) {
    console.error("Admin update user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
    });
  }
});

/* ============================
   ADMIN: DELETE USER
============================ */
/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user
 * @access  Private/Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "User removed successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
});

export default router;
