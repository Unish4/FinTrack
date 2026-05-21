import { useState, useEffect } from "react";
import { Plus, Wallet, ReceiptText, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import useTransactionStore from "../store/useTransactionStore.js";
import TransactionCard from "../components/TransactionCard.jsx";
import TransactionModal from "../components/TransactionModal.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";

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

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Page header (Card Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-white p-5 sm:p-6 rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-indigo-50 rounded-xl">
              <Wallet className="text-indigo-600 w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Transactions</h1>
          </div>
          <p className="text-sm text-gray-500 mt-2 sm:ml-14">
            {pagination?.total > 0
              ? `You have ${pagination.total} transaction${pagination.total !== 1 ? "s" : ""} on record`
              : "No transactions yet"}
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="flex justify-center items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 sm:py-3 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-indigo-500/25 active:scale-[0.98] w-full sm:w-auto mt-2 sm:mt-0"
        >
          <Plus size={18} />
          Add Transaction
        </button>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="py-24 flex justify-center">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-2xl border border-red-100 flex flex-col items-center shadow-sm">
          <AlertCircle className="text-red-500 mb-3" size={32} />
          <p className="text-red-600 font-medium px-4">{error}</p>
          <button
            onClick={fetchTransactions}
            className="mt-4 px-5 py-2.5 bg-white text-sm text-red-600 font-semibold rounded-xl shadow-sm border border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            Try again
          </button>
        </div>
      ) : !transactions || transactions.length === 0 ? (
        <div className="text-center py-20 sm:py-28 border-2 border-dashed border-gray-200 rounded-3xl bg-white shadow-sm flex flex-col items-center justify-center px-4">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-5 text-indigo-500 shadow-inner">
            <ReceiptText size={36} strokeWidth={1.5} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">No transactions found</h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto mb-8">
            Get started by adding your first transaction and start tracking your expenses and income properly!
          </p>
          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 bg-white text-indigo-600 border-2 border-indigo-100 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-indigo-50 hover:border-indigo-200 transition-all duration-200 active:scale-[0.98]"
          >
            <Plus size={18} />
            Record First Transaction
          </button>
        </div>
      ) : (
        // Transaction list
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination?.pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] gap-4 sm:gap-0">
          <p className="text-sm font-medium text-gray-500">
            Showing page <span className="text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded-md">{pagination.page}</span> of <span className="text-gray-900 font-bold bg-gray-50 px-2 py-1 rounded-md">{pagination.pages}</span>
          </p>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={() => setPage(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm disabled:shadow-none"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <button
              onClick={() => setPage(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2.5 text-sm font-semibold border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-sm disabled:shadow-none"
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
    </div>
  );
}

export default Transactions;
