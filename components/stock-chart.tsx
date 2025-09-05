"use client"

import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import type { Candle } from "@/lib/market-data"

interface StockChartProps {
  data: Candle[]
}

export function StockChart({ data }: StockChartProps) {
  // Show last 30 days for better visibility
  const recentData = data.slice(-30)

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={recentData}>
          <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => new Date(value).toLocaleDateString("en-IN", { month: "short", day: "numeric" })}
          />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value}`} />
          <Tooltip
            formatter={(value: number) => [`₹${value.toFixed(2)}`, "Price"]}
            labelFormatter={(label) => new Date(label).toLocaleDateString("en-IN")}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#0284c7"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, stroke: "#0284c7", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
