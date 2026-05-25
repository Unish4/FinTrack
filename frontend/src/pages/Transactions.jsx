import { useState, useEffect } from "react";
import {
  Plus,
  ArrowLeft,
  ArrowRight,
  FileText,
  AlertCircle,
  ArrowLeftRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import useTransactionStore from "../store/useTransactionStore.js";
import TransactionCard from "../components/TransactionCard.jsx";
import TransactionModal from "../components/TransactionModal.jsx";
import EmptyState from "../components/EmptyState";
import FilterBar from "../components/FilterBar.jsx";
import ReceiptUploader from "../components/ReceiptUploader.jsx";
import { TransactionSkeleton } from "../components/Skeleton.jsx";
import { groupTransactionsByDate } from "../utils/groupTransactionsByDate.js";

function Transactions() {
  const {
    transactions,
    pagination,
    isLoading,
    error,
    fetchTransactions,
    setPage,
  } = useTransactionStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [receiptTransaction, setReceiptTransaction] = useState(null);

  // Fetch on mount
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const handleOpenReceipt = (t) => {
    setReceiptTransaction(t);
  };

  const handleCloseReceipt = () => {
    setReceiptTransaction(null);
  };

  const groupedTransactions = groupTransactionsByDate(transactions);
  
  // State for expanded date groups
  const [expandedDates, setExpandedDates] = useState({});

  const toggleExpand = (dateLabel) => {
    setExpandedDates((prev) => ({
      ...prev,
      [dateLabel]: !prev[dateLabel]
    }));
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      {/* Page header (Card Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-slate-900/60 p-5 sm:p-6 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Transactions
            </h1>
          </div>
          <p className="text-sm text-slate-400 mt-2">
            {pagination?.total > 0
              ? `You have ${pagination.total} transaction${pagination.total !== 1 ? "s" : ""} on record`
              : "No transactions yet"}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex justify-center items-center gap-2 bg-teal-500 text-slate-950 px-5 py-2.5 sm:py-3 rounded-xl text-sm font-bold hover:bg-teal-400 transition-all duration-200 shadow-[0_0_30px_-6px_rgba(20,184,166,0.6)] active:scale-[0.98] w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8 relative z-10 w-full lg:w-auto">
        <FilterBar />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <TransactionSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-rose-500/10 rounded-2xl border border-rose-500/20 flex flex-col items-center shadow-sm">
          <AlertCircle className="text-rose-400 mb-3" size={32} />
          <p className="text-rose-400 font-medium px-4">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-5 py-2.5 bg-slate-900 text-sm text-rose-400 font-semibold rounded-xl shadow-sm border border-rose-500/20 hover:bg-rose-500/20 hover:text-rose-300 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : !groupedTransactions || groupedTransactions.length === 0 ? (
        <EmptyState
          icon={ArrowLeftRight}
          title="No transactions yet"
          description="Add your first income or expense to get started"
          actionLabel="Add Transaction"
          onAction={handleOpenAdd}
        />
      ) : // Transaction list
      groupedTransactions.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No transactions yet"
          description="Start logging your income and expenses to see them appear here."
          actionLabel="Add Transaction"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {groupedTransactions.map(({ dateLabel, transactions: dayTransactions }) => {
            const isCollapsible = dayTransactions.length > 1;
            const isExpanded = expandedDates[dateLabel] || !isCollapsible;

            return (
              <div key={dateLabel}>

                {/* ── Date header ─────────────────────── */}
                <div 
                  className={`flex items-center gap-3 mb-3 ${isCollapsible ? 'cursor-pointer select-none group' : ''}`}
                  onClick={() => isCollapsible && toggleExpand(dateLabel)}
                >
                  <span className={`text-xs font-semibold text-gray-400 uppercase
                                  tracking-wide whitespace-nowrap ${isCollapsible ? 'group-hover:text-teal-400 transition-colors' : ''}`}>
                    {dateLabel}
                  </span>
                  {/* Divider line extending to the right */}
                  <div className="flex-1 h-px bg-gray-100/10 group-hover:bg-teal-500/20 transition-colors" />
                  
                  {isCollapsible && (
                    <div className="text-gray-400 group-hover:text-teal-400 transition-colors flex items-center gap-1.5">
                      <DailySubtotal transactions={dayTransactions} />
                      <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full group-hover:bg-teal-500/10 transition-colors">
                        {dayTransactions.length}
                      </span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  )}
                  {!isCollapsible && (
                      <DailySubtotal transactions={dayTransactions} />
                  )}
                </div>

                {/* ── Cards for this date ─────────────── */}
                {isExpanded && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {dayTransactions.map((transaction) => (
                      <TransactionCard
                        key={transaction._id}
                        transaction={transaction}
                        onEdit={handleOpenEdit}
                        onUploadReceipt={handleOpenReceipt}
                        // Hide the date on the card — the group header shows it
                        hideDate
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 p-4 sm:p-5 bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm gap-4 sm:gap-0">
          <p className="text-sm font-medium text-slate-400">
            Showing page{" "}
            <span className="text-teal-400 font-bold bg-teal-500/10 px-2 py-1 rounded-md">
              {pagination.page}
            </span>{" "}
            of{" "}
            <span className="text-teal-400 font-bold bg-teal-500/10 px-2 py-1 rounded-md">
              {pagination.pages}
            </span>
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm font-semibold border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm disabled:shadow-none"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm font-semibold border border-slate-700 rounded-xl text-slate-300 hover:bg-slate-800 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm disabled:shadow-none"
            >
              Next <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        transaction={editingTransaction}
      />

      {/* Receipt Uploader Modal */}
        {receiptTransaction && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-gray-900/40 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200"
            onClick={handleCloseReceipt}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl ring-1 ring-black/5
                         w-full max-w-lg max-h-[92vh] overflow-y-auto no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              <ReceiptUploader
                transaction={receiptTransaction}
                onClose={handleCloseReceipt}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
  
  function DailySubtotal({ transactions }) {
  const net = transactions.reduce((sum, t) => {
    return t.type === 'income' ? sum + t.amount : sum - t.amount;
  }, 0);

  const isPositive = net >= 0;

  return (
    <span className={`text-xs font-semibold whitespace-nowrap
                      ${isPositive ? 'text-emerald-500' : 'text-red-400'}`}>
      {isPositive ? '+' : ''}
      {new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'NPR',
        minimumFractionDigits: 2,
      }).format(net)}
    </span>
  );
}

export default Transactions;
