import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Receipt,
  FileText,
} from "lucide-react";
import { Link } from "react-router";
import useTransactionStore from "../store/useTransactionStore.js";
import { formatCurrency, formatRelativeDate } from "../utils/formatters.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge.jsx";

function Dashboard() {
  const {
    summary,
    isSummaryLoading,
    fetchSummary,
    transactions,
    fetchTransactions,
    isLoading,
  } = useTransactionStore();

  useEffect(() => {
    fetchSummary();
    fetchTransactions();
  }, [fetchSummary, fetchTransactions]);

  const income = summary?.income || 0;
  const expense = summary?.expense || 0;
  const balance = summary?.balance || 0;

  const incomeTransactions = transactions.filter(
    (t) => t.type === "income",
  ).length;

  const expenseTransactions = transactions.filter(
    (t) => t.type === "expense",
  ).length;

  const savingsRate =
    income > 0
      ? Math.max(0, Math.round(((income - expense) / income) * 100))
      : 0;

  const isPositiveBalance = balance >= 0;

  const summaryCards = [
    {
      label: "Total Income",
      value: formatCurrency(income),
      icon: TrendingUp,

      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-100/60",
      glow: "shadow-[0_4px_20px_-4px_rgba(16,185,129,0.15)]",

      sub: `${incomeTransactions} transactions`,
    },

    {
      label: "Total Expenses",
      value: formatCurrency(expense),
      icon: TrendingDown,

      color: "text-red-500",
      bg: "bg-red-50",
      border: "border-red-100/60",
      glow: "shadow-[0_4px_20px_-4px_rgba(239,68,68,0.15)]",

      sub: `${expenseTransactions} transactions`,
    },

    {
      label: "Net Balance",
      value: formatCurrency(balance),
      icon: Wallet,

      color: isPositiveBalance ? "text-indigo-600" : "text-red-500",

      bg: isPositiveBalance ? "bg-indigo-50" : "bg-red-50",

      border: isPositiveBalance ? "border-indigo-100/60" : "border-red-100/60",

      glow: isPositiveBalance
        ? "shadow-[0_4px_20px_-4px_rgba(99,102,241,0.15)]"
        : "shadow-[0_4px_20px_-4px_rgba(239,68,68,0.15)]",

      sub: `${savingsRate}% savings rate`,
    },
  ];

  if (isLoading || isSummaryLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <LoadingSpinner />
        <p className="text-gray-400 mt-4 text-sm font-medium animate-pulse">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            {getGreeting()} 👋
          </h1>
          <p className="text-base text-gray-500 mt-1">
            Here is a summary of your financial activity
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        {summaryCards.map(
          ({ label, value, icon: Icon, color, bg, border, glow, sub }) => (
            <div
              key={label}
              className={`p-6 sm:p-7 rounded-3xl border bg-white ${border} ${glow} hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
            >
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-sm font-semibold text-gray-500">
                  {label}
                </span>
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center ${bg} ${color}`}
                >
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>
              <p
                className={`text-3xl sm:text-2xl font-bold tracking-tight relative z-10 ${color}`}
              >
                {value}
              </p>
              <p className="text-md text-gray-800 font-semibold">{sub}</p>
            </div>
          ),
        )}
      </div>

      {/* Recent transactions */}
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight">
            Recent Transactions
          </h2>
          <Link
            to="/transactions"
            className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors group"
          >
            View all
            <ArrowRight
              size={16}
              className="group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>

        {transactions.length === 0 ? (
          <EmptyState
            icon={FileText}
            title="No transactions yet"
            description="Start logging your income and expenses to see them appear here."
            actionLabel="Add First Transaction"
            onAction={() => (window.location.href = "/transactions")}
          />
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((t) => {
              const isIncome = t.type === "income";
              return (
                <div
                  key={t._id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 p-4 sm:p-5 bg-white rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-md hover:shadow-indigo-50/30 transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 sm:w-1.5 transition-colors duration-300 ${
                      isIncome
                        ? "bg-emerald-400 group-hover:bg-emerald-500"
                        : "bg-red-400 group-hover:bg-red-500"
                    }`}
                  />

                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div
                      className={`w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center shrink-0 ml-1 sm:ml-0 transition-colors duration-300 ${
                        isIncome
                          ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
                          : "bg-red-50 text-red-500 group-hover:bg-red-100"
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight size={20} />
                      ) : (
                        <ArrowDownRight size={20} />
                      )}
                    </div>

                    <span
                      className={`sm:hidden text-lg font-bold tracking-tight ${
                        isIncome ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-center pl-1 sm:pl-0">
                    <p className="text-base font-semibold text-gray-900 truncate mb-1">
                      {t.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-0.5">
                      <Badge variant={isIncome ? "income" : "expense"}>
                        {t.type}
                      </Badge>{" "}
                      <Badge variant="default">{t.category}</Badge>
                      <div className="flex items-center gap-1.5 text-gray-400">
                        <Calendar size={12} className="opacity-70" />
                        <span className="text-xs font-medium">
                          {formatRelativeDate(t.date)}
                        </span>
                      </div>
                      {t.receipt?.url && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600">
                          <Receipt size={12} />
                          <span className="text-xs font-medium">Receipt</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center sm:justify-end shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50 sm:pl-4">
                    <span
                      className={`text-lg font-bold tracking-tight text-right ${
                        isIncome ? "text-emerald-600" : "text-red-500"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {formatCurrency(t.amount)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}
export default Dashboard;
