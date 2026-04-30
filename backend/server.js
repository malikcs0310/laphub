import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import orderRoutes from "./routes/orderRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import laptopRoutes from "./routes/laptopRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Add these imports
import reviewRoutes from "./routes/reviewRoutes.js";
import testimonialRoutes from "./routes/testimonialRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables with explicit path
dotenv.config({ path: path.join(__dirname, ".env") });

// Debug: Check if env loaded properly
console.log("=================================");
console.log("🔧 ENVIRONMENT VARIABLES CHECK");
console.log("=================================");
console.log("MONGO_URI:", process.env.MONGO_URI ? "✅ LOADED" : "❌ NOT FOUND");
console.log("PORT:", process.env.PORT || "5000 (default)");
console.log(
  "JWT_SECRET:",
  process.env.JWT_SECRET ? "✅ LOADED" : "❌ NOT FOUND",
);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL || "❌ NOT FOUND");
console.log("=================================\n");

// MongoDB connection
connectDB();

const app = express();

// Middlewares
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://laphub-ecommerce.vercel.app",
      "https://laphub-backend-lrer.onrender.com",
    ],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/laptops", laptopRoutes);
app.use("/api/orders", orderRoutes); // ← Add this line
app.use("/api/contact", contactRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/testimonials", testimonialRoutes);
// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: process.env.MONGO_URI ? "Configured" : "Not configured",
  });
});

// Default test route
app.get("/", (req, res) => {
  res.json({
    message: "LapHub.pk API is running... 🚀",
    endpoints: {
      auth: "/api/auth",
      admin: "/api/admin",
      laptops: "/api/laptops",
      health: "/api/health",
    },
  });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
});
app.get("/api/test-email", async (req, res) => {
  const { sendEmail } = await import("./utils/sendEmail.js");
  await sendEmail(
    "malikcs0310@gmail.com",
    "Test Email",
    "<h1>Test</h1><p>Email working!</p>",
  );
  res.json({ message: "Email sent" });
});
