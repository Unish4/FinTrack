import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useEffect, useState } from "react";

import { formatCurrency } from "../../utils/formatters.js";

import EmptyState from "../EmptyState.jsx";

import { BarChart2 } from "lucide-react";
import Skeleton from "../Skeleton.jsx";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="
        bg-white/95 backdrop-blur-sm
        border border-gray-100
        rounded-xl
        shadow-xl
        p-3
        min-w-40
        max-w-55
      "
    >
      <p className="text-xs font-semibold text-gray-600 mb-2">{label}</p>

      <div className="space-y-1.5">
        {payload.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center justify-between gap-3 text-xs"
          >
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: entry.color }}
              />

              <span className="text-gray-500 capitalize">{entry.name}</span>
            </div>

            <span className="font-semibold text-gray-800">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthlyChart({ data, isLoading }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const hasData = data.some((d) => d.income > 0 || d.expense > 0);

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
      <div className="mb-5 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          Monthly Cash Flow
        </h3>

        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          Income vs expenses by month
        </p>
      </div>

      {isLoading ? (
        <div className="h-64">
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      ) : !hasData ? (
        <div className="h-80 flex items-center justify-center">
          <EmptyState
            icon={BarChart2}
            title="No data for this year"
            description="Add transactions to see your monthly breakdown"
          />
        </div>
      ) : (
        <div className="w-full h-80 sm:h-95">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: isMobile ? 0 : 10,
                left: isMobile ? -20 : 0,
                bottom: 0,
              }}
              barCategoryGap={isMobile ? "12%" : "20%"}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f3f4f6"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  fill: "#9ca3af",
                }}
                axisLine={false}
                tickLine={false}
                interval={0}
              />

              <YAxis
                width={isMobile ? 40 : 60}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  fill: "#9ca3af",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `$${(value / 1000).toFixed(1)}k` : `$${value}`
                }
              />

              <Tooltip
                cursor={{
                  fill: "rgba(243,244,246,0.4)",
                }}
                content={<CustomTooltip />}
              />

              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{
                  fontSize: isMobile ? "10px" : "12px",
                  paddingBottom: "16px",
                }}
                formatter={(value) => (
                  <span
                    style={{
                      color: "#6b7280",
                      textTransform: "capitalize",
                    }}
                  >
                    {value}
                  </span>
                )}
              />

              {/* Income */}
              <Bar
                dataKey="income"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                maxBarSize={isMobile ? 18 : 34}
              />

              {/* Expense */}
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
                maxBarSize={isMobile ? 18 : 34}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MonthlyChart;
