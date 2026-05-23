import Category from "../models/Category.js";
import { defaultCategories } from "../utils/seedCategories.js";

export const getCategories = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      try {
        await Category.insertMany(defaultCategories, { ordered: false });
      } catch (error) {
        // Ignore duplicate key errors (E11000) from race condition
        if (error.code !== 11000) throw error;
      }
    }
    const filter = {};
    if (req.query.type && ["income", "expense"].includes(req.query.type)) {
      filter.type = req.query.type;
    }
    const categories = await Category.find(filter)
      .sort({ type: 1, name: 1 })
      .lean();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
