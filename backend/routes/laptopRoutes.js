import express from "express";
import multer from "multer";

import {
  addLaptop,
  getAllLaptops,
  getSingleLaptop,
  updateLaptop,
  deleteLaptop,
  getFeaturedLaptops, // 👈 add this
} from "../controllers/laptopController.js";

const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Routes
router.post("/add", upload.array("images", 5), addLaptop);
router.get("/", getAllLaptops);
router.get("/featured", getFeaturedLaptops);
router.get("/:id", getSingleLaptop);

router.put("/:id", upload.array("images", 5), updateLaptop);
router.delete("/:id", deleteLaptop);

export default router;
