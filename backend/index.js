//Packages
import dotenv from "dotenv";

// Load environment variables FIRST
dotenv.config();

import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

//Utils
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const port = process.env.PORT || 5000;

// Initialize database connection
const startServer = async () => {
  try {
    await connectDB();

    const app = express();

    // CORS configuration
    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.get("/", (req, res) => {
      res.send("Hello World...");
    });

    app.use("/api/users", userRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/products", productRoutes);
    app.use("/api/upload", uploadRoutes);
    app.use("/api/orders", orderRoutes);

    app.get("/api/config/paypal", (req, res) => {
      res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
    });

    // Global error handler (must be after routes)
    app.use((error, req, res, next) => {
      console.error("=== GLOBAL ERROR HANDLER ===");
      console.error("Error:", error.message);
      console.error("Stack:", error.stack);
      res.status(500).json({
        error: "Internal server error",
        message: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    });

    app.listen(port, () => {
      console.log(`Server running on port: ${port}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

// Start the server
startServer();
