import express from "express";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
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

// ✅ Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "laphub",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Routes
router.post("/add", upload.array("images", 5), addLaptop);
router.get("/", getAllLaptops);
router.get("/featured", getFeaturedLaptops);
router.get("/:id", getSingleLaptop);
router.put("/:id", upload.array("images", 5), updateLaptop);
router.delete("/:id", deleteLaptop);
router.patch("/:id/stock", updateStock);

export default router;
