import { create } from "zustand";

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
  },
  summary: {
    income: 0,
    expenses: 0,
    balance: 0,
  },
  isLoading: false,
  error: null,

  //Actions
  setTransactions: (transactions) => set({ transactions }),
  setSummary: (summary) => set({ summary }),
  setFilters: (filters) => set((state) => ({ ...state.filters, ...filters })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearFilters: () =>
    set({
      filters: {
        search: "",
        type: "",
        category: "",
        startDate: "",
        endDate: "",
      },
    }),
}));

export default useTransactionStore;
