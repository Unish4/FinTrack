// src/App.jsx
import { useEffect } from "react";
import { Routes, Route } from "react-router";
import { SignIn, SignUp, useUser, useAuth } from "@clerk/react";
import toast, { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "./layouts/MainLayout.jsx";

// Components
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Analytics from "./pages/Analytics.jsx";
import NotFound from "./pages/NotFound.jsx";

// Store & Service
import useAuthStore from "./store/useAuthStore.js";
import { registerUser, getUserProfile } from "./services/authService.js";

function App() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const { setUser, clearUser } = useAuthStore();

  useEffect(() => {
    const syncUser = async () => {
      if (isSignedIn && clerkUser) {
        try {
          // Register user in our DB (safe to call every login — backend deduplicates)
          await registerUser({
            clerkUserId: clerkUser.id,
            email: clerkUser.primaryEmailAddress?.emailAddress,
            name: clerkUser.fullName,
          });

          // Fetch our DB user document and store it in Zustand
          const profile = await getUserProfile();
          setUser(profile.data);
        } catch (error) {
          console.error("Failed to sync user:", error);
          toast.error("Failed to sync user data. Please try again.");
        }
      } else if (!isSignedIn) {
        clearUser();
      }
    };

    if (isLoaded) {
      syncUser();
    }
  }, [isLoaded, isSignedIn, clerkUser, setUser, clearUser]);

  // Clerk is still initializing — don't render anything yet
  if (!isLoaded) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#4F46E5", secondary: "#fff" } },
        }}
      />

      <Routes>
        {/* Public auth routes — Clerk's built-in UI components */}
        <Route
          path="/sign-in/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <SignIn routing="path" path="/sign-in" />
            </div>
          }
        />
        <Route
          path="/sign-up/*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <SignUp routing="path" path="/sign-up" />
            </div>
          }
        />

        {/* Protected routes — all wrapped in ProtectedRoute + MainLayout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Transactions />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Analytics />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 — catch everything else */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
