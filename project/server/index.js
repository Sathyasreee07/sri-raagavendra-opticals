import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import orderRoutes from "./routes/orders.js";
import appointmentRoutes from "./routes/appointments.js";
import cartRoutes from "./routes/cart.js";
import wishlistRoutes from "./routes/wishlist.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

/* ============================
   DATABASE CONNECTION
============================ */
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

connectDB();

/* ============================
   MIDDLEWARE
============================ */
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sri-ragavendra-opticals.netlify.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());
app.use(morgan("dev"));

/* ============================
   ROUTES
============================ */
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);

/* ============================
   404 HANDLER
============================ */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found"
  });
});

/* ============================
   ERROR HANDLER
============================ */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "production" ? null : err.stack
  });
});

/* ============================
   SERVER START
============================ */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
