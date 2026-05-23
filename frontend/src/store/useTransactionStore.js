import { create } from "zustand";
import {
  getTransactions,
  getTransactionSummary,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService.js";
import toast from "react-hot-toast";
import { uploadReceipt, deleteReceipt } from "../services/receiptService.js";

const useTransactionStore = create((set, get) => ({
  //State
  transactions: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
  filters: {
    search: "",
    type: "",
    category: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 10,
  },
  summary: {
    income: 0,
    expenses: 0,
    balance: 0,
  },
  isLoading: false,
  error: null,
  isSummaryLoading: false,

  //Actions
  fetchTransactions: async () => {
    set({ isLoading: true, error: null });
    try {
      const filters = get().filters;
      const data = await getTransactions(filters);
      set({
        transactions: data.data,
        pagination: data.pagination,
        isLoading: false,
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch transactions";
      set({ isLoading: false, error: message });
      toast.error(message);
    }
  },

  fetchSummary: async () => {
    set({ isSummaryLoading: true });
    try {
      const data = await getTransactionSummary();
      set({ summary: data.data, isSummaryLoading: false });
    } catch (error) {
      set({ isSummaryLoading: false });
      toast.error("Failed to load summary");
    }
  },

  addTransaction: async (formData) => {
    try {
      await createTransaction(formData);
      toast.success("Transaction added!");
      get().fetchTransactions();
      get().fetchSummary();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to add transaction";
      toast.error(message);
      throw error;
    }
  },

  editTransaction: async (id, formData) => {
    try {
      await updateTransaction(id, formData);
      toast.success("Transaction updated!");
      get().fetchTransactions();
      get().fetchSummary();
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to update transaction";
      toast.error(message);
      throw error;
    }
  },

  removeTransaction: async (id) => {
    const previousTransactions = get().transactions;
    set((state) => ({
      transactions: state.transactions.filter((t) => t._id !== id),
    }));

    try {
      await deleteTransaction(id);
      toast.success("Transaction deleted!");
      get().fetchTransactions();
      get().fetchSummary();
    } catch (error) {
      set({ transactions: previousTransactions });
      toast.error("Failed to delete transaction");
    }
  },
  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters, page: 1 },
    }));
    get().fetchTransactions();
  },

  setPage: (page) => {
    set((state) => ({
      filters: { ...state.filters, page },
    }));
    get().fetchTransactions();
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        type: "",
        category: "",
        startDate: "",
        endDate: "",
        page: 1,
        limit: 10,
      },
    });
    get().fetchTransactions();
  },

  addReceipt: async (transactionId, file) => {
    try {
      const data = await uploadReceipt(transactionId, file);
      // Update just this transaction's receipt in the local array
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t._id === transactionId
            ? {
                ...t,
                receipt: { url: data.data.url, publicId: data.data.publicId },
              }
            : t,
        ),
      }));
      toast.success("Receipt uploaded");
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to upload receipt";
      toast.error(message);
      throw error;
    }
  },

  removeReceipt: async (transactionId) => {
    try {
      await deleteReceipt(transactionId);
      set((state) => ({
        transactions: state.transactions.map((t) =>
          t._id === transactionId
            ? { ...t, receipt: { url: null, publicId: null } }
            : t,
        ),
      }));
      toast.success("Receipt removed");
    } catch (error) {
      toast.error("Failed to remove receipt");
      throw error;
    }
  },
}));

export default useTransactionStore;
