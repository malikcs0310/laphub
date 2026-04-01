import express from "express";
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact,
  getContactStats,
} from "../controllers/contactController.js";

const router = express.Router();

// All routes public (for testing)
router.post("/", createContact);
router.get("/", getContacts);
router.get("/stats", getContactStats);
router.get("/:id", getContactById);
router.put("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
