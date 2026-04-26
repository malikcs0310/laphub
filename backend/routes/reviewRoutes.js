import express from "express";
import {
  addReview,
  getProductReviews,
  getProductRatingSummary, // ✅ Add this import
  markHelpful,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} from "../controllers/reviewController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/product/:productId", getProductReviews);
router.get("/product/:productId/summary", getProductRatingSummary); // ✅ Add this route

// Protected routes
router.post("/", protect, addReview);
router.put("/:id/helpful", protect, markHelpful);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllReviews);
router.put("/admin/:id", protect, adminOnly, updateReviewStatus);
router.delete("/admin/:id", protect, adminOnly, deleteReview);

export default router;
