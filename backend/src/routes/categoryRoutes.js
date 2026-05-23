import express from "express";
import { getCategories } from "../controllers/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protected — only logged in users can fetch categories
router.get("/", protect, getCategories);

export default router;
