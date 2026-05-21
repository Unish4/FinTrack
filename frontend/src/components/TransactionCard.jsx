import { useState } from "react";
import {
  Pencil,
  Trash2,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Tag,
} from "lucide-react";
import { formatCurrency, formatRelativeDate } from "../utils/formatters.js";
import useTransactionStore from "../store/useTransactionStore.js";

function TransactionCard({ transaction, onEdit }) {
  const { removeTransaction } = useTransactionStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const isIncome = transaction.type === "income";

  const handleDelete = async () => {
    if (!window.confirm("Delete this transaction?")) return;

    setIsDeleting(true);
    await removeTransaction(transaction._id);
    // Component may unmount after deletion, so skip state update
  };
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/50 transition-all duration-300 relative overflow-hidden">
      {/* Decorative Accent Line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 transition-colors duration-300 ${
          isIncome
            ? "bg-emerald-400 group-hover:bg-emerald-500"
            : "bg-red-400 group-hover:bg-red-500"
        }`}
      />

      <div className="flex items-center justify-between w-full sm:w-auto">
        {/* Icon Circle */}
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ml-1 sm:ml-0 transition-colors duration-300 ${
            isIncome
              ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
              : "bg-red-50 text-red-500 group-hover:bg-red-100"
          }`}
        >
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>

        {/* Show amount top right on mobile only */}
        <span
          className={`sm:hidden text-lg font-bold tracking-tight ${
            isIncome ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pl-1 sm:pl-0">
        <p className="text-base font-semibold text-gray-900 truncate mb-1">
          {transaction.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-gray-50 text-gray-500 border border-gray-100">
            <Tag size={12} className="opacity-70" />
            <span className="text-xs font-medium">{transaction.category}</span>
          </div>

          <div className="flex items-center gap-1.5 text-gray-400">
            <Calendar size={12} className="opacity-70" />
            <span className="text-xs font-medium">
              {formatRelativeDate(transaction.date)}
            </span>
          </div>

          {transaction.receipt?.url && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
              <Receipt size={12} />
              <span className="text-xs font-medium">Receipt</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 pl-1 sm:pl-0">
        {/* Amount (Desktop) */}
        <span
          className={`hidden sm:block text-lg font-bold shrink-0 tracking-tight text-right ${
            isIncome ? "text-emerald-600" : "text-red-500"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>

        {/* Actions */}
        <div className="flex justify-end items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-full sm:w-auto">
          <button
            onClick={() => onEdit(transaction)}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-indigo-600 focus:text-indigo-600 hover:bg-indigo-50 focus:bg-indigo-50 transition-colors flex items-center justify-center border border-gray-100 sm:border-transparent hover:border-indigo-100"
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-gray-400 hover:text-red-600 focus:text-red-600 hover:bg-red-50 focus:bg-red-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center border border-gray-100 sm:border-transparent hover:border-red-100"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TransactionCard;
