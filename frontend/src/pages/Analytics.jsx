import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useAnalyticsStore from "../store/useAnalyticsStore.js";
import MonthlyChart from "../components/charts/MonthlyChart.jsx";
import CategoryPieChart from "../components/charts/CategoryPieChart.jsx";
import IncomeExpenseChart from "../components/charts/IncomeExpenseChart.jsx";
import { formatCurrency } from "../utils/formatters.js";

function Analytics() {
  const {
    selectedYear,
    setYear,
    monthlyData,
    isMonthlyLoading,
    expenseCategoryData,
    incomeCategoryData,
    isCategoryLoading,
    fetchAll,
  } = useAnalyticsStore();

  useEffect(() => {
    fetchAll();
  }, []);

  const yearTotals = monthlyData.reduce(
    (acc, month) => ({
      income: acc.income + month.income,
      expense: acc.expense + month.expense,
    }),
    { income: 0, expense: 0 },
  );

  const yearBalance = yearTotals.income - yearTotals.expense;

  const currentYear = new Date().getFullYear();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Analytics
          </h1>

          <p className="text-sm sm:text-base text-slate-400 mt-1">
            Your financial trends and insights
          </p>
        </div>

        {/* Year Selector */}
        <div
          className="
            flex items-center justify-between
            w-full sm:w-auto
            bg-slate-900/60 border border-slate-800 backdrop-blur-sm
            rounded-2xl px-3 py-2
            shadow-sm
          "
        >
          <button
            onClick={() => setYear(selectedYear - 1)}
            disabled={selectedYear <= 2020}
            className="
              p-2 rounded-xl
              hover:bg-slate-800 text-slate-400 hover:text-white
              transition
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <ChevronLeft size={18} />
          </button>

          <span className="text-sm sm:text-base font-semibold text-slate-200 min-w-15 text-center">
            {selectedYear}
          </span>

          <button
            onClick={() => setYear(selectedYear + 1)}
            disabled={selectedYear >= currentYear}
            className="
              p-2 rounded-xl
              hover:bg-slate-800 text-slate-400 hover:text-white
              transition
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {[
          {
            label: `${selectedYear} Income`,
            value: formatCurrency(yearTotals.income),
            color: "text-teal-400",
            bg: "bg-teal-500/10",
          },
          {
            label: `${selectedYear} Expenses`,
            value: formatCurrency(yearTotals.expense),
            color: "text-rose-400",
            bg: "bg-rose-500/10",
          },
          {
            label: "Net Balance",
            value: formatCurrency(yearBalance),
            color: yearBalance >= 0 ? "text-cyan-400" : "text-rose-400",
            bg: yearBalance >= 0 ? "bg-cyan-500/10" : "bg-rose-500/10",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="
              bg-slate-900/60
              border border-slate-800 backdrop-blur-sm
              rounded-2xl
              p-5
              shadow-sm
              hover:shadow-md
              transition-shadow
            "
          >
            <div
              className={`w-fit px-3 py-1 rounded-full text-xs font-medium mb-3 ${bg} ${color}`}
            >
              {label}
            </div>

            <p
              className={`
                text-2xl sm:text-3xl
                font-bold tracking-tight
                wrap-break-words
                ${color}
              `}
            >
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Full Width Chart */}
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-sm p-3 sm:p-5 overflow-hidden">
          <MonthlyChart data={monthlyData} isLoading={isMonthlyLoading} />
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-sm p-3 sm:p-5 overflow-hidden">
            <CategoryPieChart
              expenseData={expenseCategoryData}
              incomeData={incomeCategoryData}
              isLoading={isCategoryLoading}
            />
          </div>

          <div className="bg-slate-900/60 rounded-2xl border border-slate-800 backdrop-blur-sm shadow-sm p-3 sm:p-5 overflow-hidden">
            <IncomeExpenseChart
              data={monthlyData}
              isLoading={isMonthlyLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
