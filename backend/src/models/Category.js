import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["income", "expense"],
    },
    icon: {
      type: String,
      default: "📦",
    },
  },
  {
    timestamps: true,
  },
);

categorySchema.index({ name: 1, type: 1 }, { unique: true });
const Category = mongoose.model("Category", categorySchema);
export default Category;
