// Transaction controller with all CRUD operations
import Transaction from "../models/Transaction.js";

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

export const getTransactions = async (req, res, next) => {
  try {
    const {
      search,
      type,
      category,
      page = 1,
      limit = 10,
      startDate,
      endDate,
    } = req.query;

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

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
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

// backend/src/controllers/transactionController.js
// Add these two new controller functions at the bottom

/*
  GET /api/transactions/summary/monthly
  Query params: ?year=2025

  Returns an array of 12 months with income and expense totals.
  Months with no transactions still appear with 0 values — this
  ensures the chart always shows all 12 bars, not just active months.
*/
export const getMonthlySummary = async (req, res, next) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const summary = await Transaction.aggregate([
      {
        /*
          Stage 1: $match
          Filter to only this user's transactions in the selected year.
          We use $gte (Jan 1) and $lt (Jan 1 next year) to get the full year.
        */
        $match: {
          userId: req.user.id,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        /*
          Stage 2: $group
          Group by month AND type together.
          Each group gets the sum of amounts in that month+type combo.

          $month extracts the month number (1-12) from the date field.

          Result looks like:
          [
            { _id: { month: 1, type: 'income' }, total: 3500 },
            { _id: { month: 1, type: 'expense' }, total: 450 },
            { _id: { month: 2, type: 'income' }, total: 3500 },
            ...
          ]
        */
        $group: {
          _id: {
            month: { $month: "$date" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      {
        // Stage 3: Sort by month ascending
        $sort: { "_id.month": 1 },
      },
    ]);

    /*
      Transform the aggregation result into a clean array of 12 months.
      The aggregation only returns months that have data — we need all 12
      so the chart always renders a complete year on the X axis.
    */
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Build a map for quick lookup: { '1-income': 3500, '1-expense': 450, ... }
    const dataMap = {};
    summary.forEach(({ _id, total }) => {
      dataMap[`${_id.month}-${_id.type}`] = total;
    });

    // Build the full 12-month array, filling 0 for missing months
    const result = monthNames.map((month, index) => {
      const monthNum = index + 1;
      return {
        month, // 'Jan'
        income: dataMap[`${monthNum}-income`] || 0,
        expense: dataMap[`${monthNum}-expense`] || 0,
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      year,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategorySummary = async (req, res, next) => {
  try {
    const type = req.query.type || "expense";
    const year = parseInt(req.query.year) || new Date().getFullYear();

    const summary = await Transaction.aggregate([
      {
        $match: {
          userId: req.user.id,
          type,
          date: {
            $gte: new Date(`${year}-01-01`),
            $lt: new Date(`${year + 1}-01-01`),
          },
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);
    const grandTotal = summary.reduce((sum, item) => sum + item.total, 0);

    const result = summary.map((item) => ({
      category: item._id,
      total: item.total,
      count: item.count,
      percentage:
        grandTotal > 0 ? Math.round((item.total / grandTotal) * 100) : 0,
    }));

    res.status(200).json({
      success: true,
      data: result,
      grandTotal,
      type,
      year,
    });
  } catch (error) {
    next(error);
  }
};
