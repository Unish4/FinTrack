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

import LoadingSpinner from "../LoadingSpinner.jsx";
import EmptyState from "../EmptyState.jsx";

import { PieChart as PieIcon } from "lucide-react";

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
        bg-white/95 backdrop-blur-sm
        border border-gray-100
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

        <span className="text-xs font-semibold text-gray-700 wrap-break-words">
          {data.name}
        </span>
      </div>

      <p className="text-xs text-gray-500">
        {formatCurrency(data.value)}{" "}
        <span className="text-gray-400">({data.payload.percentage}%)</span>
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
        bg-white
        rounded-2xl
        border border-gray-100
        shadow-sm
        p-4 sm:p-6
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
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">
            Category Breakdown
          </h3>

          <p className="text-xs text-gray-400 mt-1">Spending by category</p>
        </div>

        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto">
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
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }
              `}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-75 flex items-center justify-center">
          <LoadingSpinner />
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
                      color: "#6b7280",
                    }}
                  >
                    {value}
                    <span
                      style={{
                        color: "#9ca3af",
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
