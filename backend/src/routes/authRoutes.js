import express from "express";
import { registerUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", registerUser);

// GET /api/auth/me - Get current user profile (protected)
router.get("/me", protect, getUserProfile);

export default router;
