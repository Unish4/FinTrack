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
import useCategoryStore from "../store/useCategoryStore.js";

function TransactionModal({ isOpen, onClose, transaction = null }) {
  const { addTransaction, editTransaction } = useTransactionStore();
  const { fetchCategories, getCategoriesByType } = useCategoryStore();

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
    if (isOpen) fetchCategories();
  }, [isOpen, fetchCategories]);

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

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

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

  const categories = getCategoriesByType(formData.type);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {isEditMode ? "Edit Transaction" : "New Transaction"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto no-scrollbar">
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="bg-slate-950/50 p-1.5 rounded-xl flex gap-1 mb-2 border border-slate-800">
              <button
                type="button"
                onClick={() =>
                  handleChange({ target: { name: "type", value: "expense" } })
                }
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  formData.type === "expense"
                    ? "bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30 shadow-none"
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
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
                    ? "bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/30 shadow-none"
                    : "text-slate-400 hover:text-slate-300 hover:bg-slate-800"
                }`}
              >
                <ArrowUpRight size={16} />
                Income
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
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
                  className={`w-full pl-5 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-600 ${
                    errors.amount
                      ? "border-rose-500/50 bg-rose-500/10"
                      : "border-slate-700"
                  }`}
                />
              </div>
              {errors.amount && (
                <p className="text-xs text-rose-400">{errors.amount}</p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Category
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <List size={18} />
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-slate-900 text-slate-200 appearance-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-600 ${
                    errors.category
                      ? "border-rose-500/50 bg-rose-500/10"
                      : "border-slate-700"
                  }`}
                >
                  <option className="bg-slate-900 text-slate-200" value="">Select a category</option>
                  {categories.map((cat) => (
                    <option className="bg-slate-900 text-slate-200" key={cat._id} value={cat.name}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.category && (
                <p className="text-xs text-rose-400">{errors.category}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Description
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <AlignLeft size={18} />
                </div>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder={
                    formData.type === "expense"
                      ? "What was this for?"
                      : "What was this from?"
                  }
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-600 ${
                    errors.description
                      ? "border-rose-500/50 bg-rose-500/10"
                      : "border-slate-700"
                  }`}
                />
              </div>
              {errors.description && (
                <p className="text-xs text-rose-400">{errors.description}</p>
              )}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">
                Date
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Calendar size={18} />
                </div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  max={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm outline-none transition-all duration-200 bg-slate-900 text-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 hover:border-slate-600 ${
                    errors.date ? "border-rose-500/50 bg-rose-500/10" : "border-slate-700"
                  }`}
                />
              </div>
              {errors.date && (
                <p className="text-xs text-rose-400">{errors.date}</p>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 border border-slate-700 bg-slate-800 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-2.5 bg-teal-500 text-slate-950 rounded-xl text-sm font-bold hover:bg-teal-400 hover:shadow-[0_0_20px_-5px_rgba(20,184,166,0.5)] hover:-translate-y-0.5 transition-all duration-200 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
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
