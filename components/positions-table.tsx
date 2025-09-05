"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import type { Position } from "@/lib/portfolio"

interface PositionsTableProps {
  positions: Position[]
}

export function PositionsTable({ positions }: PositionsTableProps) {
  if (positions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-600">
            No positions yet. Start trading to see your portfolio here.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Qty</th>
                <th className="pb-3 font-medium">Avg Price</th>
                <th className="pb-3 font-medium">Current Price</th>
                <th className="pb-3 font-medium">Market Value</th>
                <th className="pb-3 font-medium">P&L</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr key={position.symbol} className="border-b">
                  <td className="py-3 font-medium">{position.symbol}</td>
                  <td className="py-3">{position.quantity}</td>
                  <td className="py-3">₹{position.averagePrice.toFixed(2)}</td>
                  <td className="py-3">₹{position.currentPrice.toFixed(2)}</td>
                  <td className="py-3">₹{position.marketValue.toLocaleString("en-IN")}</td>
                  <td className="py-3">
                    <div
                      className={`flex items-center gap-1 ${position.unrealizedPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}
                    >
                      {position.unrealizedPnL >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>₹{position.unrealizedPnL.toFixed(0)}</span>
                      <Badge
                        variant="outline"
                        className={
                          position.unrealizedPnL >= 0
                            ? "border-emerald-200 text-emerald-700"
                            : "border-red-200 text-red-700"
                        }
                      >
                        {position.unrealizedPnLPercent >= 0 ? "+" : ""}
                        {position.unrealizedPnLPercent.toFixed(2)}%
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
