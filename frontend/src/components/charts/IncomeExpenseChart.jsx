import {
  AreaChart,
  Area,
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

import { TrendingUp } from "lucide-react";
import { ChartSkeleton } from "../Skeleton.jsx";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="
        bg-slate-900/95 backdrop-blur-sm
        border border-slate-800
        rounded-xl
        shadow-xl
        p-3
        min-w-42.5
        max-w-57.5
      "
    >
      <p className="text-xs font-semibold text-slate-400 mb-2">{label}</p>

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

              <span className="text-slate-400 capitalize">{entry.name}</span>
            </div>

            <span className="font-semibold text-slate-200">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>

      {payload.length === 2 && (
        <div
          className="
            mt-2 pt-2
            border-t border-slate-800
            flex items-center justify-between
            text-xs
          "
        >
          <span className="text-slate-400">Net</span>

          <span
            className={`font-semibold ${
              payload[0].value - payload[1].value >= 0
                ? "text-teal-400"
                : "text-rose-400"
            }`}
          >
            {formatCurrency(payload[0].value - payload[1].value)}
          </span>
        </div>
      )}
    </div>
  );
}

function IncomeExpenseChart({ data, isLoading }) {
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
        bg-transparent
        flex flex-col h-full
      "
    >
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-white">
          Income vs Expenses Trend
        </h3>

        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          How your cash flow changes over time
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <ChartSkeleton key={i} />
          ))}
        </div>
      ) : !hasData ? (
        <div className="h-80 flex items-center justify-center">
          <EmptyState
            icon={TrendingUp}
            title="No trend data yet"
            description="Add transactions across multiple months to see trends"
          />
        </div>
      ) : (
        <div className="w-full h-80 sm:h-95">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: isMobile ? 0 : 10,
                left: isMobile ? -20 : 0,
                bottom: 0,
              }}
            >
              {/* Gradients */}
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2dd4bf" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#2dd4bf" stopOpacity={0} />
                </linearGradient>

                <linearGradient
                  id="expenseGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#334155"
              />

              <XAxis
                dataKey="month"
                interval={0}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                width={isMobile ? 40 : 60}
                tick={{
                  fontSize: isMobile ? 10 : 12,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) =>
                  value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`
                }
              />

              <Tooltip
                cursor={{
                  stroke: "#475569",
                  strokeWidth: 1,
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
                      color: "#94a3b8",
                      textTransform: "capitalize",
                    }}
                  >
                    {value}
                  </span>
                )}
              />

              {/* Income */}
              <Area
                type="monotone"
                dataKey="income"
                stroke="#2dd4bf"
                strokeWidth={2.5}
                fill="url(#incomeGradient)"
                dot={{
                  fill: "#2dd4bf",
                  strokeWidth: 0,
                  r: isMobile ? 2 : 3,
                }}
                activeDot={{
                  r: isMobile ? 4 : 5,
                  strokeWidth: 0,
                }}
              />

              {/* Expense */}
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#fb7185"
                strokeWidth={2.5}
                fill="url(#expenseGradient)"
                dot={{
                  fill: "#fb7185",
                  strokeWidth: 0,
                  r: isMobile ? 2 : 3,
                }}
                activeDot={{
                  r: isMobile ? 4 : 5,
                  strokeWidth: 0,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default IncomeExpenseChart;
