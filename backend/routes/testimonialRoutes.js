import express from "express";
import {
  submitTestimonial,
  getTestimonials,
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/", submitTestimonial);
router.get("/", getTestimonials);

// Admin routes
router.get("/admin/all", protect, adminOnly, getAllTestimonials);
router.put("/admin/:id", protect, adminOnly, updateTestimonialStatus);
router.delete("/admin/:id", protect, adminOnly, deleteTestimonial);

export default router;
