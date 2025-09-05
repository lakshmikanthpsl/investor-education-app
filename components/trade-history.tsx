"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Trade } from "@/lib/portfolio"

interface TradeHistoryProps {
  trades: Trade[]
}

export function TradeHistory({ trades }: TradeHistoryProps) {
  if (trades.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-slate-600">No trades yet. Your trading history will appear here.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium">Date & Time</th>
                <th className="pb-3 font-medium">Symbol</th>
                <th className="pb-3 font-medium">Side</th>
                <th className="pb-3 font-medium">Quantity</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((trade) => (
                <tr key={trade.id} className="border-b">
                  <td className="py-3 text-sm">{new Date(trade.timestamp).toLocaleString("en-IN")}</td>
                  <td className="py-3 font-medium">{trade.symbol}</td>
                  <td className="py-3">
                    <Badge variant={trade.side === "BUY" ? "default" : "secondary"}>{trade.side}</Badge>
                  </td>
                  <td className="py-3">{trade.quantity}</td>
                  <td className="py-3">₹{trade.price.toFixed(2)}</td>
                  <td className="py-3">₹{trade.value.toLocaleString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
