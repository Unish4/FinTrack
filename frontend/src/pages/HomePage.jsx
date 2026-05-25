import { Link, Navigate } from "react-router";
import { useAuth } from "@clerk/react";
import {
  BarChart2,
  ShieldCheck,
  Receipt,
  TrendingUp,
  Search,
  ArrowRight,
  Heart,
  Folders,
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
      accent: "teal",
    },
    {
      icon: BarChart2,
      title: "Visual analytics",
      description:
        "Monthly bar charts, category breakdowns, and income-vs-expense trends updated in real time.",
      accent: "cyan",
    },
    {
      icon: Search,
      title: "Search & filter",
      description:
        "Find any transaction instantly by description, category, date range, or type.",
      accent: "amber",
    },
    {
      icon: ShieldCheck,
      title: "Secure by default",
      description:
        "Every account is protected by Clerk authentication. Your data is always private.",
      accent: "teal",
    },
    {
      icon: TrendingUp,
      title: "Balance at a glance",
      description:
        "Dashboard shows your total income, total expenses, and net balance the moment you log in.",
      accent: "cyan",
    },
    {
      icon: Folders,
      title: "Category management",
      description:
        "Organise transactions by category — Food, Transport, Salary, Entertainment and more.",
      accent: "amber",
    },
  ];

  const accentMap = {
    teal: {
      bg: "bg-teal-500/10",
      text: "text-teal-400",
      border: "border-teal-500/20",
      glow: "group-hover:shadow-teal-500/10",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      text: "text-cyan-400",
      border: "border-cyan-500/20",
      glow: "group-hover:shadow-cyan-500/10",
    },
    amber: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/20",
      glow: "group-hover:shadow-amber-500/10",
    },
  };

  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <LoadingSpinner fullScreen />;
  if (isLoaded && isSignedIn) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-teal-500/30 selection:text-teal-200">
      <Navbar />

      <main className="grow flex flex-col relative overflow-hidden">
        {/* Background effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-255 h-125 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute top-40 left-0 w-100 h-100 bg-cyan-500/5 rounded-full blur-3xl" />
          <div className="absolute top-60 right-0 w-100 h-100 bg-teal-600/5 rounded-full blur-3xl" />
          {/* Grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(20,184,166,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.8) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Hero */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 sm:pt-32 sm:pb-24 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-mono text-white leading-[1.08] max-w-4xl mx-auto tracking-tighter">
            Track every expense, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-teal-400 via-cyan-300 to-teal-400">
              Understand your money
            </span>
          </h1>

          <p className="mt-7 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            FinTrack helps you log income and expenses, organise receipts, and
            visualise where your money goes — all in one secure, beautiful
            dashboard.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-base transition-all duration-200 shadow-[0_0_30px_-6px_rgba(20,184,166,0.6)] hover:shadow-[0_0_40px_-4px_rgba(20,184,166,0.7)] hover:-translate-y-0.5"
            >
              Start for free
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-slate-700 hover:border-slate-500 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300 hover:text-white font-semibold text-base transition-all duration-200"
            >
              I already have an account
            </Link>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto sm:max-w-md">
            {[
              { value: "100%", label: "Secure" },
              { value: "Real-time", label: "Analytics" },
              { value: "Free", label: "Forever" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-teal-400">
                  {value}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Features grid */}
        <section className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-sans text-white tracking-tight">
              Everything you need
            </h2>
            <p className="mt-4 text-base text-center text-slate-400 max-w-xl mx-auto">
              Powerful features to help you take control of your finance and
              manage better.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map(({ icon: Icon, title, description, accent }) => {
              const a = accentMap[accent];
              return (
                <div
                  key={title}
                  className={`group relative p-7 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm hover:border-slate-700 hover:bg-slate-900 hover:shadow-xl ${a.glow} transition-all duration-300`}
                >
                  {/* Corner glow */}
                  <div
                    className={`absolute top-0 right-0 w-24 h-24 rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl ${a.bg}`}
                  />
                  <div
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${a.bg} border ${a.border}`}
                  >
                    <Icon size={22} className={a.text} />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    {description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="FinTrack Logo"
              className="w-4 h-4 object-contain"
            />
            <span className="font-serif text-white tracking-tight">
              FinTrack
            </span>
          </div>

          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} FinTrack. All rights reserved.
          </p>

          <p className="text-sm text-slate-500 flex items-center gap-1.5">
            Made with{" "}
            <Heart fill="currentColor" className="text-rose-500" size={14} /> by{" "}
            <a
              href="https://github.com/Unish4"
              target="_blank"
              rel="noreferrer"
              className="text-teal-400 hover:text-teal-300 font-semibold transition-colors"
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
