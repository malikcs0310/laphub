import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserBlock,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminMiddleware.js";

console.log("🔵 Loading adminRoutes.js...");

const router = express.Router();

// Simple test route (no auth needed)
router.get("/test", (req, res) => {
  console.log("✅ Test route hit!");
  res.json({
    success: true,
    message: "Admin route is working!",
    timestamp: new Date().toISOString(),
  });
});

// Public admin route (admin auth required)
router.get("/dashboard", adminAuth, (req, res) => {
  res.json({
    message: "Welcome to Admin Dashboard",
    admin: req.admin.email,
  });
});

// Apply auth middleware to all routes after this
router.use(protect);
router.use(adminOnly);

console.log("🔵 Applying auth middleware to admin routes");

// User management routes
router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);
router.patch("/users/:id/block", toggleUserBlock);

console.log("✅ Admin routes registered:");
console.log("   - GET /test (no auth)");
console.log("   - GET /users");
console.log("   - GET /users/:id");
console.log("   - PUT /users/:id");
console.log("   - DELETE /users/:id");
console.log("   - PATCH /users/:id/block");

export default router;
