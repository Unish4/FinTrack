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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Analytics
          </h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Your financial trends and insights
          </p>
        </div>

        {/* Year Selector */}
        <div
          className="
            flex items-center justify-between
            w-full sm:w-auto
            bg-white border border-gray-200
            rounded-2xl px-3 py-2
            shadow-sm
          "
        >
          <button
            onClick={() => setYear(selectedYear - 1)}
            disabled={selectedYear <= 2020}
            className="
              p-2 rounded-xl
              hover:bg-gray-100
              transition
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <ChevronLeft size={18} className="text-gray-600" />
          </button>

          <span className="text-sm sm:text-base font-semibold text-gray-800 min-w-15 text-center">
            {selectedYear}
          </span>

          <button
            onClick={() => setYear(selectedYear + 1)}
            disabled={selectedYear >= currentYear}
            className="
              p-2 rounded-xl
              hover:bg-gray-100
              transition
              disabled:opacity-30
              disabled:cursor-not-allowed
            "
          >
            <ChevronRight size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 sm:mb-8">
        {[
          {
            label: `${selectedYear} Income`,
            value: formatCurrency(yearTotals.income),
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: `${selectedYear} Expenses`,
            value: formatCurrency(yearTotals.expense),
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "Net Balance",
            value: formatCurrency(yearBalance),
            color: yearBalance >= 0 ? "text-indigo-600" : "text-red-500",
            bg: yearBalance >= 0 ? "bg-indigo-50" : "bg-red-50",
          },
        ].map(({ label, value, color, bg }) => (
          <div
            key={label}
            className="
              bg-white
              border border-gray-100
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
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 overflow-hidden">
          <MonthlyChart data={monthlyData} isLoading={isMonthlyLoading} />
        </div>

        {/* Bottom Charts */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 overflow-hidden">
            <CategoryPieChart
              expenseData={expenseCategoryData}
              incomeData={incomeCategoryData}
              isLoading={isCategoryLoading}
            />
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5 overflow-hidden">
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
