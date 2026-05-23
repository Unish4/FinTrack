import { create } from "zustand";
import {
  getMonthlySummary,
  getCategorySummary,
} from "../services/analyticsService.js";
import toast from "react-hot-toast";

const useAnalyticsStore = create((set, get) => ({
  selectedYear: new Date().getFullYear(),

  // Monthly chart data — 12 items always
  monthlyData: [],
  isMonthlyLoading: false,

  // Category pie chart data
  expenseCategoryData: [],
  incomeCategoryData: [],
  isCategoryLoading: false,

  // ── Actions ──────────────────────────────────────────────

  setYear: (year) => {
    set({ selectedYear: year });
    get().fetchMonthlyData(year);
    get().fetchCategoryData(year);
  },

  fetchMonthlyData: async (year) => {
    const targetYear = year || get().selectedYear;
    set({ isMonthlyLoading: true });
    try {
      const data = await getMonthlySummary(targetYear);
      set({ monthlyData: data.data, isMonthlyLoading: false });
    } catch (error) {
      set({ isMonthlyLoading: false });
      toast.error("Failed to load monthly data");
    }
  },

  fetchCategoryData: async (year) => {
    const targetYear = year || get().selectedYear;
    set({ isCategoryLoading: true });
    try {
      const [expenseData, incomeData] = await Promise.all([
        getCategorySummary("expense", targetYear),
        getCategorySummary("income", targetYear),
      ]);

      set({
        expenseCategoryData: expenseData.data,
        incomeCategoryData: incomeData.data,
        isCategoryLoading: false,
      });
    } catch (error) {
      set({
        expenseCategoryData: [],
        incomeCategoryData: [],
        isCategoryLoading: false,
      });
      toast.error("Failed to load category data");
    }
  },
  fetchAll: async () => {
    const year = get().selectedYear;
    get().fetchMonthlyData(year);
    get().fetchCategoryData(year);
  },
}));

export default useAnalyticsStore;
