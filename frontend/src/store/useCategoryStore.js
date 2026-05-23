import { create } from "zustand";
import { getCategories } from "../services/categoryService.js";

const useCategoryStore = create((set, get) => ({
  // State
  categories: [], // all categories
  isLoading: false,
  hasFetched: false, // prevents re-fetching on every page visit

  // Actions
  fetchCategories: async () => {
    // Don't re-fetch if we already have them
    if (get().hasFetched) return;

    set({ isLoading: true });
    try {
      const data = await getCategories();
      set({
        categories: data.data,
        isLoading: false,
        hasFetched: true,
      });
    } catch (error) {
      set({ isLoading: false });
      console.error("Failed to fetch categories:", error);
    }
  },

  getCategoriesByType: (type) => {
    const { categories } = get();
    if (!type) return categories;
    return categories.filter((c) => c.type === type);
  },
}));

export default useCategoryStore;
