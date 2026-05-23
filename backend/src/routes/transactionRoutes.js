import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
  getMonthlySummary,
  getCategorySummary,
} from "../controllers/transactionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All transaction routes are protected
router.use(protect);

// POST /api/transactions - Create new transaction
router.post("/", createTransaction);

// GET /api/transactions - Get all transactions for user (with filters)
router.get("/", getTransactions);

// GET /api/transactions/summary - Get summary (income, expense, balance)
router.get("/summary", getTransactionSummary);
router.get("/summary/monthly", getMonthlySummary);
router.get("/summary/by-category", getCategorySummary);

// GET /api/transactions/:id - Get single transaction by ID
router.get("/:id", getTransactionById);

// PUT /api/transactions/:id - Update transaction
router.put("/:id", updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete("/:id", deleteTransaction);

export default router;
