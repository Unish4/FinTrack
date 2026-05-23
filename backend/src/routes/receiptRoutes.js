import express from "express";
import {
  uploadReceipt,
  deleteReceipt,
} from "../controllers/receiptController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js";

const router = express.Router({ mergeParams: true });

router.post(
  "/upload-receipt",
  protect,
  upload.single("receipt"),
  uploadReceipt,
);

router.delete("/receipt", protect, deleteReceipt);

export default router;
