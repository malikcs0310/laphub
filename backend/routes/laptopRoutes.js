import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
  addLaptop,
  getAllLaptops,
  getSingleLaptop,
  updateLaptop,
  deleteLaptop,
  getFeaturedLaptops,
  updateStock,
} from "../controllers/laptopController.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Routes
router.post("/add", upload.array("images", 5), addLaptop);
router.get("/", getAllLaptops);
router.get("/featured", getFeaturedLaptops);
router.get("/:id", getSingleLaptop);
router.put("/:id", upload.array("images", 5), updateLaptop);
router.delete("/:id", deleteLaptop);
router.patch("/:id/stock", updateStock); // Update stock when order placed

export default router;
