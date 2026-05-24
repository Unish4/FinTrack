import { useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Receipt,
  FileText,
  Clock,
  Wallet,
} from "lucide-react";
import { Link } from "react-router";
import useTransactionStore from "../store/useTransactionStore.js";
import { formatCurrency, formatRelativeDate } from "../utils/formatters.js";
import EmptyState from "../components/EmptyState";
import Badge from "../components/Badge.jsx";
import {
  SummaryCardSkeleton,
  TransactionSkeleton,
} from "../components/Skeleton.jsx";

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

  const income  = summary?.income  || 0;
  const expense = summary?.expense || 0;
  const balance = summary?.balance || 0;

  const incomeTransactions  = transactions.filter((t) => t.type === "income").length;
  const expenseTransactions = transactions.filter((t) => t.type === "expense").length;
  const savingsRate = income > 0
    ? Math.max(0, Math.round(((income - expense) / income) * 100))
    : 0;
  const isPositiveBalance = balance >= 0;

  const summaryCards = [
    {
      label: "Total Income",
      value: formatCurrency(income),
      icon: TrendingUp,
      sub: `${incomeTransactions} transaction${incomeTransactions !== 1 ? "s" : ""}`,
      gradient: "from-teal-500/[0.12] via-teal-500/[0.06] to-transparent",
      border: "border-teal-500/20 hover:border-teal-400/40",
      iconBg: "bg-teal-500/10 border border-teal-500/20",
      iconColor: "text-teal-400",
      valueColor: "text-teal-300",
      orbColor: "bg-teal-500/20",
      shadow: "hover:shadow-[0_8px_32px_-8px_rgba(20,184,166,0.25)]",
      bar: "bg-gradient-to-r from-teal-500 to-teal-400",
    },
    {
      label: "Total Expenses",
      value: formatCurrency(expense),
      icon: TrendingDown,
      sub: `${expenseTransactions} transaction${expenseTransactions !== 1 ? "s" : ""}`,
      gradient: "from-rose-500/[0.12] via-rose-500/[0.06] to-transparent",
      border: "border-rose-500/20 hover:border-rose-400/40",
      iconBg: "bg-rose-500/10 border border-rose-500/20",
      iconColor: "text-rose-400",
      valueColor: "text-rose-300",
      orbColor: "bg-rose-500/20",
      shadow: "hover:shadow-[0_8px_32px_-8px_rgba(244,63,94,0.25)]",
      bar: "bg-gradient-to-r from-rose-500 to-rose-400",
    },
    {
      label: "Net Balance",
      value: formatCurrency(balance),
      icon: Wallet,
      sub: `${savingsRate}% savings rate`,
      gradient: isPositiveBalance
        ? "from-cyan-500/[0.12] via-cyan-500/[0.06] to-transparent"
        : "from-rose-500/[0.12] via-rose-500/[0.06] to-transparent",
      border: isPositiveBalance
        ? "border-cyan-500/20 hover:border-cyan-400/40"
        : "border-rose-500/20 hover:border-rose-400/40",
      iconBg: isPositiveBalance
        ? "bg-cyan-500/10 border border-cyan-500/20"
        : "bg-rose-500/10 border border-rose-500/20",
      iconColor:  isPositiveBalance ? "text-cyan-400"  : "text-rose-400",
      valueColor: isPositiveBalance ? "text-cyan-300"  : "text-rose-300",
      orbColor:   isPositiveBalance ? "bg-cyan-500/20" : "bg-rose-500/20",
      shadow: isPositiveBalance
        ? "hover:shadow-[0_8px_32px_-8px_rgba(6,182,212,0.25)]"
        : "hover:shadow-[0_8px_32px_-8px_rgba(244,63,94,0.25)]",
      bar: isPositiveBalance
        ? "bg-gradient-to-r from-cyan-500 to-cyan-400"
        : "bg-gradient-to-r from-rose-500 to-rose-400",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-teal-500/30 selection:text-teal-200 relative overflow-x-hidden">

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-teal-500/5 rounded-full blur-3xl" />
        <div className="absolute top-48 left-0 w-[350px] h-[350px] bg-cyan-500/4 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-teal-600/4 rounded-full blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `linear-gradient(rgba(20,184,166,0.8) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(20,184,166,0.8) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Page content ── */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">

        {/* ── Page Header ── */}
        <div className="mb-9 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold uppercase tracking-widest mb-3">
              Overview
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getGreeting()} 👋
            </h1>
            <p className="text-md text-slate-400 mt-1.5">
              Here is a summary of your financial activity
            </p>
          </div>

          {/* Live date chip */}
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-md font-medium self-start sm:self-auto">
            <Clock size={12} className="text-teal-400 size-5" />
            {new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </div>
        </div>

        {/* ── Summary Cards ── */}
        {isSummaryLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
            {[1, 2, 3].map((i) => <SummaryCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 mb-10">
            {summaryCards.map(({ label, value, icon: Icon, sub, gradient, border, iconBg, iconColor, valueColor, orbColor, shadow, bar }) => (
              <div
                key={label}
                className={`group relative rounded-2xl border ${border} bg-gradient-to-br ${gradient} bg-slate-900/70 backdrop-blur-sm p-6 overflow-hidden cursor-default transition-all duration-300 hover:-translate-y-1 ${shadow}`}
              >
                {/* Top accent bar */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${bar} opacity-60 group-hover:opacity-100 transition-opacity`} />

                {/* Orb glow */}
                <div className={`absolute -bottom-8 -right-8 w-32 h-32 rounded-full ${orbColor} blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-500`} />

                <div className="relative flex items-start justify-between mb-5">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon size={19} className={iconColor} strokeWidth={2.5} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pt-1">
                    {label}
                  </span>
                </div>

                <p className={`relative text-3xl font-extrabold tracking-tight ${valueColor} mb-1.5 tabular-nums`}>
                  {value}
                </p>
                <div className="relative flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${iconColor} opacity-70`} />
                  <p className="text-xs font-medium text-slate-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Recent Transactions ── */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm overflow-hidden">

          {/* Section header */}
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-teal-400 to-cyan-500" />
              <h2 className="text-base font-bold text-white tracking-tight">Recent Transactions</h2>
            </div>
            <Link
              to="/transactions"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-400 hover:text-teal-300 transition-colors group px-3 py-1.5 rounded-lg hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20"
            >
              View all
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Body */}
          <div className="p-4 sm:p-5">
            {isLoading ? (
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="py-1"><TransactionSkeleton /></div>
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="py-8">
                <EmptyState
                  icon={FileText}
                  title="No transactions yet"
                  description="Start logging your income and expenses to see them appear here."
                  actionLabel="Add First Transaction"
                  onAction={() => (window.location.href = "/transactions")}
                />
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, 5).map((t) => {
                  const isIncome = t.type === "income";
                  return (
                    <div
                      key={t._id}
                      className={`group relative flex flex-col sm:flex-row sm:items-center gap-3 p-6 rounded-xl border transition-all duration-200 overflow-hidden cursor-default
                        ${isIncome
                          ? "border-slate-800 bg-slate-900/40 hover:border-teal-500/30 hover:bg-teal-500/[0.04]"
                          : "border-slate-800 bg-slate-900/40 hover:border-rose-500/25 hover:bg-rose-500/[0.04]"
                        }`}
                    >
                      {/* Left accent bar */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl ${isIncome ? "bg-teal-500" : "bg-rose-500"}`} />

                      {/* Icon + mobile amount row */}
                      <div className="flex items-center justify-between w-full sm:w-auto pl-2 sm:pl-1">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200
                          ${isIncome
                            ? "bg-teal-500/10 text-teal-400 group-hover:bg-teal-500/20 group-hover:scale-110"
                            : "bg-rose-500/10 text-rose-400 group-hover:bg-rose-500/20 group-hover:scale-110"
                          }`}
                        >
                          {isIncome ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        </div>
                        <span className={`sm:hidden text-sm font-bold tabular-nums ${isIncome ? "text-teal-400" : "text-rose-400"}`}>
                          {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
                        </span>
                      </div>

                      {/* Description + meta */}
                      <div className="flex-1 min-w-0 pl-1 sm:pl-0">
                        <p className="text-sm font-semibold text-slate-200 truncate mb-1.5">
                          {t.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                          <Badge variant={isIncome ? "income" : "expense"}>{t.type}</Badge>
                          <Badge variant="default">{t.category}</Badge>
                          <div className="flex items-center gap-1 text-slate-500">
                            <Calendar size={10} />
                            <span className="text-[11px] font-medium">{formatRelativeDate(t.date)}</span>
                          </div>
                          {t.receipt?.url && (
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                              <Receipt size={10} />
                              <span className="text-[11px] font-medium">Receipt</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop amount */}
                      <div className="hidden sm:flex items-center shrink-0">
                        <span className={`text-sm font-extrabold tracking-tight tabular-nums ${isIncome ? "text-teal-400" : "text-rose-400"}`}>
                          {isIncome ? "+" : "−"}{formatCurrency(t.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        {/* Bottom spacer */}
        <div className="h-4" />
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default Dashboard;