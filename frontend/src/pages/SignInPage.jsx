// src/pages/SignInPage.jsx
import { SignIn } from "@clerk/react";
import { Link } from "react-router";
import { Wallet } from "lucide-react";

function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Simple top bar — keeps branding visible */}
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

      {/* Clerk's SignIn component centered on the page */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Heading above the Clerk widget */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-sm text-gray-500 mt-2">
              Sign in to your FinTrack account
            </p>
          </div>

          {/*
            Clerk's SignIn component.

            routing="path" + path="/sign-in" tells Clerk to use React
            Router for navigation instead of Clerk's own routing.
            This is required when using React Router v6+.

            afterSignInUrl="/dashboard" sends users to the dashboard
            after a successful sign-in.
          */}
          <SignIn
            routing="path"
            path="/sign-in"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                // Remove Clerk's default card shadow/border so it
                // blends with our page background
                card: "shadow-none border-0 bg-transparent p-0",
                // Keep the form inside looking normal
                formButtonPrimary:
                  "bg-indigo-600 hover:bg-indigo-700 text-sm normal-case",
              },
            }}
          />

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link
              to="/sign-up"
              className="text-indigo-600 hover:underline font-medium"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignInPage;
