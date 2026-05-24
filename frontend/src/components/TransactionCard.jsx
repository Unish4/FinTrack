import { useState } from "react";
import {
  Pencil,
  Trash2,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Upload,
} from "lucide-react";
import { formatCurrency, formatRelativeDate } from "../utils/formatters.js";
import useTransactionStore from "../store/useTransactionStore.js";
import Badge from "./Badge.jsx";
import ConfirmDialog from "./ConfirmDialog.jsx";
import ReceiptModal from "./ReceiptModal.jsx";

function TransactionCard({ transaction, onEdit, onUploadReceipt }) {
  const { removeTransaction } = useTransactionStore();
  const [showConfirm, setShowConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const isIncome = transaction.type === "income";
  const hasReceipt = !!transaction.receipt?.url;

  const handleDeleteConfirm = async () => {
    setShowConfirm(false);
    setIsDeleting(true);
    await removeTransaction(transaction._id);
    setIsDeleting(false);
  };

  return (
    <div className={`group flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 md:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
      isIncome
        ? "border-slate-800 bg-slate-900/40 hover:border-teal-500/30 hover:bg-teal-500/[0.04]"
        : "border-slate-800 bg-slate-900/40 hover:border-rose-500/25 hover:bg-rose-500/[0.04]"
    }`}>
      {/* Decorative Accent Line */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 transition-colors duration-300 ${
          isIncome
            ? "bg-teal-500 group-hover:bg-teal-400"
            : "bg-rose-500 group-hover:bg-rose-400"
        }`}
      />

      <div className="flex items-center justify-between w-full sm:w-auto">
        {/* Icon Circle */}
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ml-1 sm:ml-0 transition-colors duration-300 ${
            isIncome
              ? "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20"
              : "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20"
          }`}
        >
          {isIncome ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
        </div>

        {/* Show amount top right on mobile only */}
        <span
          className={`sm:hidden text-lg font-bold tracking-tight ${
            isIncome ? "text-teal-400" : "text-rose-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 flex flex-col justify-center pl-1 sm:pl-0">
        <p className="text-base font-semibold text-slate-200 truncate mb-1">
          {transaction.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
          <div className="flex items-center gap-2">
            <Badge variant={isIncome ? "income" : "expense"}>
              {transaction.type}
            </Badge>
            <Badge variant="default">{transaction.category}</Badge>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500">
            <Calendar size={12} className="opacity-70" />
            <span className="text-xs font-medium">
              {formatRelativeDate(transaction.date)}
            </span>
          </div>

          {hasReceipt && (
            <button
              onClick={() => setShowReceiptModal(true)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full
                         text-xs font-medium text-cyan-400 bg-cyan-500/10
                         border border-cyan-500/20 hover:bg-cyan-500/20
                         transition-colors"
              title="View receipt"
            >
              <Receipt size={11} />
              <span>Receipt</span>
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-800/50 pl-1 sm:pl-0">
        {/* Amount (Desktop) */}
        <span
          className={`hidden sm:block text-lg font-bold shrink-0 tracking-tight text-right ${
            isIncome ? "text-teal-400" : "text-rose-400"
          }`}
        >
          {isIncome ? "+" : "-"}
          {formatCurrency(transaction.amount)}
        </span>

        {/* Actions */}
        <div className="flex justify-end items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:-translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 w-full sm:w-auto">
          <button
            onClick={() => onUploadReceipt(transaction)}
            className={`p-1.5 rounded-lg transition-colors
                        ${
                          hasReceipt
                            ? "flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-cyan-400 hover:text-cyan-300 focus:text-cyan-300 hover:bg-cyan-500/10 focus:bg-cyan-500/10 transition-colors flex items-center justify-center border border-slate-800 sm:border-transparent hover:border-cyan-500/20"
                            : "flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-teal-400 focus:text-teal-400 hover:bg-teal-500/10 focus:bg-teal-500/10 transition-colors flex items-center justify-center border border-slate-800 sm:border-transparent hover:border-teal-500/20"
                        }`}
            title={hasReceipt ? "Manage receipt" : "Add receipt"}
          >
            <Upload size={14} />
          </button>

          <button
            onClick={() => onEdit(transaction)}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-teal-400 focus:text-teal-400 hover:bg-teal-500/10 focus:bg-teal-500/10 transition-colors flex items-center justify-center border border-slate-800 sm:border-transparent hover:border-teal-500/20"
            title="Edit transaction"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => setShowConfirm(true)}
            disabled={isDeleting}
            className="flex-1 sm:flex-none p-2 sm:p-2.5 rounded-xl text-slate-500 hover:text-rose-400 focus:text-rose-400 hover:bg-rose-500/10 focus:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center border border-slate-800 sm:border-transparent hover:border-rose-500/20"
            title="Delete transaction"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      {showConfirm && (
        <ConfirmDialog
          isOpen={showConfirm}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowConfirm(false)}
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction? This action cannot be undone."
          confirmLabel="Delete"
          isDangerous={true}
        />
      )}

      {showReceiptModal && (
        <ReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          url={transaction.receipt?.url}
          description={`Receipt for ${transaction.description}`}
        />
      )}
    </div>
  );
}

export default TransactionCard;
