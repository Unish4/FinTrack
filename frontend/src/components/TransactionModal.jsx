import { useState, useEffect } from "react";
import {
  X,
  List,
  AlignLeft,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import useTransactionStore from "../store/useTransactionStore.js";
import { getCategoriesForType } from "../utils/categories.js";

function TransactionModal({ isOpen, onClose, transaction = null }) {
  const { addTransaction, editTransaction } = useTransactionStore();
  const isEditMode = transaction !== null;

  const [formData, setFormData] = useState({
    amount: "",
    type: "expense",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const syncState = () => {
      if (isOpen && isEditMode) {
        setFormData({
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          description: transaction.description,
          date: new Date(transaction.date).toISOString().split("T")[0],
        });
      } else if (!isOpen) {
        setFormData({
          amount: "",
          type: "expense",
          category: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
        });
        setErrors({});
      }
    };
    syncState();
  }, [isOpen, isEditMode, transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "type") {
      setFormData((prev) => ({ ...prev, type: value, category: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      newErrors.amount = "Enter a valid amount greater than 0";
    }
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    if (formData.description.trim().length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    }
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        amount: Number(formData.amount),
      };

      if (isEditMode) {
        await editTransaction(transaction._id, payload);
      } else {
        await addTransaction(payload);
      }

      onClose();
    } catch {
      // Errors are handled in the store actions
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const categories = getCategoriesForType(formData.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all ring-1 ring-black/5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight">
            {isEditMode ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-gray-100/80 p-1.5 rounded-xl flex gap-1 mb-2">
              <button
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "type", value: "expense" } })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  formData.type === "expense"
                    ? "bg-white text-red-600 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <ArrowDownRight size={16} />
                Expense
              </button>
              <button
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "type", value: "income" } })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  formData.type === "income"
                    ? "bg-white text-emerald-600 shadow-sm ring-1 ring-black/5"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                }`}
              >
                <ArrowUpRight size={16} />
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Amount
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full pl-5 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 ${
                    errors.amount
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-red-500">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <List size={18} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-white appearance-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 ${
                    errors.category
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-xs text-red-500">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <AlignLeft size={18} />
                </div>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="What was this for?"
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 ${
                    errors.description
                      ? "border-red-300 bg-red-50"
                      : "border-gray-200"
                  }`}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 ${
                    errors.date ? "border-red-300 bg-red-50" : "border-gray-200"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-red-500">{errors.date}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
              >
                {isSubmitting
                  ? "Saving..."
                  : isEditMode
                    ? "Save Changes"
                    : "Add Transaction"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TransactionModal;
