import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount must be a positive number"],
    },
    type: {
      type: String,
      enum: ["income", "expense"],
      required: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    description: {
      type: String,
      default: [true, "Description is required"],
      maxlength: [255, "Description cannot exceed 255 characters"],
    },
    date: {
      type: Date,
      default: Date.now,
    },
    receipt: {
      type: String,
      uploadedAt: Date,
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
