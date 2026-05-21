// src/pages/SignUpPage.jsx
import { SignUp } from "@clerk/react";
import { Link } from "react-router";
import { Wallet } from "lucide-react";

function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="px-6 h-16 flex items-center border-b border-gray-100 bg-white">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-75 transition-opacity"
        >
          <Wallet className="text-indigo-600" size={20} />
          <span className="text-base font-semibold text-gray-900">
            FinTrack
          </span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-sm text-gray-500 mt-2">
              Start tracking your finances today — it's free
            </p>
          </div>

          {/*
            afterSignUpUrl="/dashboard": after sign-up completes,
            send the user to the dashboard. App.jsx's useEffect
            will then fire, register the user in our backend,
            and populate the Zustand store.
          */}
          <SignUp
            routing="path"
            path="/sign-up"
            afterSignUpUrl="/dashboard"
            appearance={{
              elements: {
                card: "shadow-none border-0 bg-transparent p-0",
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              },
            }}
          />

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUpPage;
