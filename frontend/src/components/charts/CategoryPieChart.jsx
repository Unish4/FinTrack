import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { useState, useEffect } from "react";

import { formatCurrency } from "../../utils/formatters.js";

import EmptyState from "../EmptyState.jsx";

import { PieChart as PieIcon } from "lucide-react";
import { SummaryCardSkeleton } from "../Skeleton.jsx";

const COLORS = [
  "#6366f1",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
  "#14b8a6",
  "#84cc16",
];

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0];

  return (
    <div
      className="
        bg-slate-900/95 backdrop-blur-sm
        border border-slate-800
        rounded-xl
        shadow-xl
        p-3
        max-w-45
      "
    >
      <div className="flex items-center gap-2 mb-1">
        <div
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: data.payload.fill }}
        />

        <span className="text-xs font-semibold text-slate-200 wrap-break-words">
          {data.name}
        </span>
      </div>

      <p className="text-xs text-slate-400">
        {formatCurrency(data.value)}{" "}
        <span className="text-slate-500">({data.payload.percentage}%)</span>
      </p>
    </div>
  );
}

function CustomLabel({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percentage,
}) {
  if (percentage < 6) return null;

  const RADIAN = Math.PI / 180;

  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;

  const x = cx + radius * Math.cos(-midAngle * RADIAN);

  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      fontSize={10}
      fontWeight={700}
    >
      {percentage}%
    </text>
  );
}

function CategoryPieChart({ expenseData, incomeData, isLoading }) {
  const [activeType, setActiveType] = useState("expense");

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const data = activeType === "expense" ? expenseData : incomeData;

  const hasData = data && data.length > 0;

  return (
    <div
      className="
        bg-transparent
        flex flex-col h-full
      "
    >
      {/* Header */}
      <div
        className="
          flex flex-col gap-4
          sm:flex-row sm:items-center sm:justify-between
          mb-6
        "
      >
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Category Breakdown
          </h3>

          <p className="text-xs text-slate-400 mt-1">Spending by category</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-slate-800/50 rounded-xl p-1 w-full sm:w-auto">
          {["expense", "income"].map((type) => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className={`
                flex-1 sm:flex-none
                px-4 py-2
                rounded-lg
                text-xs font-semibold
                capitalize
                transition-all
                ${
                  activeType === type
                    ? "bg-slate-700 text-white shadow-sm"
                    : "text-slate-400 hover:text-slate-200"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <SummaryCardSkeleton key={i} />
          ))}
        </div>
      ) : !hasData ? (
        <div className="h-75 flex items-center justify-center">
          <EmptyState
            icon={PieIcon}
            title={`No ${activeType} data`}
            description={`Add ${activeType} transactions to see the breakdown`}
          />
        </div>
      ) : (
        <div className="w-full h-80 sm:h-90">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="total"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={isMobile ? 75 : 100}
                innerRadius={isMobile ? 42 : 55}
                paddingAngle={2}
                labelLine={false}
                label={CustomLabel}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.category}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />

              <Legend
                layout={isMobile ? "horizontal" : "vertical"}
                verticalAlign={isMobile ? "bottom" : "middle"}
                align={isMobile ? "center" : "right"}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: "11px",
                  paddingTop: isMobile ? 18 : 0,
                }}
                formatter={(value, entry) => (
                  <span
                    style={{
                      color: "#94a3b8",
                    }}
                  >
                    {value}
                    <span
                      style={{
                        color: "#64748b",
                        marginLeft: 4,
                      }}
                    >
                      {entry.payload.percentage}%
                    </span>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default CategoryPieChart;
