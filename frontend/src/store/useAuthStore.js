import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useAuthStore;
