import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* ================================
   PROTECT MIDDLEWARE
================================ */
export const protect = async (req, res, next) => {
  let token;

  // Check Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // No token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token missing"
    });
  }

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not configured");
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user (exclude sensitive fields)
    const user = await User.findById(decoded.id).select(
      "-password -passwordResetToken -passwordResetExpires"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired"
    });
  }
};

/* ================================
   ADMIN MIDDLEWARE
================================ */
export const admin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authorized"
    });
  }

  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: "Admin access required"
    });
  }
};
