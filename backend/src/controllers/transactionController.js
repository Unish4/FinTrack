// Transaction controller with all CRUD operations
import Transaction from "../models/Transaction.js";

/**
 * POST /api/transactions
 * Create a new transaction
 * Body: { amount, type, category, description, date }
 */
export const createTransaction = async (req, res, next) => {
  try {
    const { amount, type, category, description, date } = req.body;

    // Validation
    if (!amount || !type || !category || !description) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        required: ["amount", "type", "category", "description"],
      });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Type must be 'income' or 'expense'",
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      type,
      category,
      description,
      date: date || new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Transaction created successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions
 * Get all transactions for user (with optional search & filters)
 * Query params: ?search=keyword&type=expense&category=Food&page=1&limit=10
 */
export const getTransactions = async (req, res, next) => {
  try {
    const { search, type, category, page = 1, limit = 10 } = req.query;

    // Build filter object
    const filter = { userId: req.user.id };

    if (type && ["income", "expense"].includes(type)) {
      filter.type = type;
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      // Search in description (case-insensitive)
      filter.description = { $regex: search, $options: "i" };
    }

    // Calculate pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    // Get total count for pagination info
    const total = await Transaction.countDocuments(filter);

    // Get transactions (sorted by date, newest first)
    const transactions = await Transaction.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(); // .lean() for read-only queries (faster)

    res.status(200).json({
      success: true,
      data: transactions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/transactions/:id
 * Get single transaction by ID
 */
export const getTransactionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id, // Ensure user owns this transaction
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/transactions/:id
 * Update transaction
 * Body: { amount, type, category, description, date }
 */
export const updateTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { amount, type, category, description, date } = req.body;

    // Check if transaction exists and belongs to user
    const transaction = await Transaction.findOne({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Update only provided fields
    if (amount !== undefined) transaction.amount = amount;
    if (type && ["income", "expense"].includes(type)) {
      transaction.type = type;
    }
    if (category) transaction.category = category;
    if (description) transaction.description = description;
    if (date) transaction.date = date;

    await transaction.save();

    res.status(200).json({
      success: true,
      message: "Transaction updated successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/transactions/:id
 * Delete transaction
 */
export const deleteTransaction = async (req, res, next) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      userId: req.user.id,
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Transaction deleted successfully",
      data: transaction,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/summary

export const getTransactionSummary = async (req, res, next) => {
  try {
    // Use MongoDB aggregation for calculations
    const summary = await Transaction.aggregate([
      {
        $match: { userId: req.user.id }, // Filter by user
      },
      {
        $group: {
          _id: "$type", // Group by type (income/expense)
          total: { $sum: "$amount" }, // Sum amounts
        },
      },
    ]);

    // Format summary
    let income = 0;
    let expense = 0;

    summary.forEach((item) => {
      if (item._id === "income") income = item.total;
      if (item._id === "expense") expense = item.total;
    });

    res.status(200).json({
      success: true,
      data: {
        income,
        expense,
        balance: income - expense,
      },
    });
  } catch (error) {
    next(error);
  }
};
