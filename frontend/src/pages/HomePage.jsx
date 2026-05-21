import { Link, Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import {
  Wallet,
  BarChart2,
  ShieldCheck,
  Receipt,
  TrendingUp,
  Search,
  ArrowRight,
  Heart,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import Navbar from "../components/Navbar";

const HomePage = () => {
  const features = [
    {
      icon: Receipt,
      title: "Log transactions instantly",
      description:
        "Add income or expenses in seconds. Attach receipt photos directly to any transaction.",
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: BarChart2,
      title: "Visual analytics",
      description:
        "Monthly bar charts, category breakdowns, and income-vs-expense trends updated in real time.",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: Search,
      title: "Search & filter",
      description:
        "Find any transaction instantly by description, category, date range, or type.",
      color: "bg-amber-50 text-amber-600",
    },
    {
      icon: ShieldCheck,
      title: "Secure by default",
      description:
        "Every account is protected by Clerk authentication. Your data is always private.",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Balance at a glance",
      description:
        "Dashboard shows your total income, total expenses, and net balance the moment you log in.",
      color: "bg-purple-50 text-purple-600",
    },
    {
      icon: Wallet,
      title: "Category management",
      description:
        "Organise transactions by category — Food, Transport, Salary, Entertainment and more.",
      color: "bg-rose-50 text-rose-600",
    },
  ];

  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) {
    return <LoadingSpinner fullScreen />;
  }

  if (isLoaded && isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col font-sans">
      <Navbar />

      <main className="grow flex flex-col relative overflow-hidden">
        {/* Hero Section */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-18 pb-16 sm:pt-28 sm:pb-20 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-[1.1] max-w-4xl mx-auto tracking-tight">
            Track every expense, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-300% animate-gradient">
              understand your money
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            FinTrack helps you log income and expenses, organise receipts, and
            visualise where your money goes — all in one secure, beautiful
            dashboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 px-4 sm:px-0">
            <Link
              to="/sign-up"
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-4 rounded-xl font-semibold
                         hover:bg-indigo-700 hover:-translate-y-0.5 shadow-[0_8px_20px_-6px_rgba(79,70,229,0.4)] hover:shadow-[0_12px_24px_-6px_rgba(79,70,229,0.5)] transition-all duration-200 flex items-center justify-center gap-2"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/sign-in"
              className="w-full sm:w-auto text-gray-700 px-8 py-4 rounded-xl bg-white border border-gray-200 
                         hover:bg-gray-50 hover:border-gray-300 transition-colors font-semibold shadow-sm flex items-center justify-center"
            >
              I already have an account
            </Link>
          </div>
        </section>

        {/* ── Features grid ───────────────────────────────── */}
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 sm:pb-32 relative z-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful features to help you manage your wealth effectively.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map(({ icon: Icon, title, description, color }) => (
              <div
                key={title}
                className="group p-8 rounded-3xl border border-gray-100 bg-white/70 backdrop-blur-md shadow-sm
                           hover:shadow-xl hover:shadow-indigo-50/50 hover:border-indigo-100 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center
                                mb-6 transition-transform duration-300 group-hover:scale-110 ${color}`}
                >
                  <Icon size={28} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">
                  {title}
                </h3>
                <p className="text-base text-gray-500 leading-relaxed grow">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="border-t border-gray-100 bg-white mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-4">
          <div className="flex items-center gap-2 group cursor-pointer text-gray-900 hover:text-indigo-600 transition-colors">
            <div className="bg-indigo-50 p-2 rounded-xl group-hover:bg-indigo-100 transition-colors">
              <Wallet size={20} className="text-indigo-600" />
            </div>
            <span className="font-extrabold text-xl tracking-tight">
              FinTrack
            </span>
          </div>

          <p className="text-sm font-medium text-gray-400 order-3 sm:order-0">
            &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>

          <p className="text-sm font-medium text-gray-500 flex items-center justify-center gap-1.5 order-2 sm:order-0">
            Made with{" "}
            <Heart fill="currentColor" className="text-rose-500" size={16} /> by
            <a
              href="https://github.com/Unish4"
              target="_blank"
              rel="noreferrer"
              className="text-gray-700 hover:text-indigo-600 decoration-indigo-300 font-semibold transition-colors"
            >
              Unish
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
