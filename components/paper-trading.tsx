"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { dataByTicker, type Ticker } from "@/lib/market-data"
import { simulatePortfolio, type Trade, type Portfolio, computeVolatility, computeMaxDrawdown } from "@/lib/simulation"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

export function PaperTrading() {
  const tickers = Object.keys(dataByTicker) as Ticker[]
  const [ticker, setTicker] = useState<Ticker>(tickers[0])
  const [cash, setCash] = useState<number>(100000)
  const [trades, setTrades] = useState<Trade[]>([])
  const series = dataByTicker[ticker]
  const [qty, setQty] = useState<number>(10)
  const lastPrice = series[series.length - 1].close

  const portfolio: Portfolio = useMemo(() => simulatePortfolio(cash, trades, series), [cash, trades, series])

  const vol = useMemo(() => computeVolatility(series), [series])
  const mdd = useMemo(() => computeMaxDrawdown(series), [series])

  const placeTrade = (side: "BUY" | "SELL") => {
    const t: Trade = { side, qty, price: lastPrice, ticker, ts: Date.now() }
    setTrades((prev) => [...prev, t])
  }

  const reset = () => {
    setCash(100000)
    setTrades([])
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Chart: {ticker}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={series}>
                <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <XAxis dataKey="date" hide />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="close" stroke="#0284c7" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-slate-700 md:max-w-md">
            <div className="flex items-center justify-between">
              <span>Volatility (annualized)</span>
              <span className="font-medium">{vol}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Max drawdown</span>
              <span className="font-medium">{mdd}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-6 grid gap-4">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="grid gap-1">
              <label className="text-sm text-slate-600">Ticker</label>
              <Select
                value={ticker}
                onValueChange={(v) => {
                  setTicker(v as Ticker)
                  setTrades([])
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {tickers.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-slate-600">Quantity</label>
              <input
                type="number"
                min={1}
                className="h-9 w-28 rounded border border-slate-300 px-2"
                value={qty}
                onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
              />
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-slate-600">Last price</label>
              <div className="font-medium">₹{lastPrice.toFixed(2)}</div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-slate-600">Cash</label>
              <div className="font-medium">₹{portfolio.cash.toFixed(2)}</div>
            </div>

            <div className="grid gap-1">
              <label className="text-sm text-slate-600">Portfolio Value</label>
              <div className="font-medium">₹{portfolio.value.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="bg-emerald-500 hover:bg-emerald-600" onClick={() => placeTrade("BUY")}>
              Buy
            </Button>
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => placeTrade("SELL")}>
              Sell
            </Button>
            <Button variant="outline" onClick={reset}>
              Reset
            </Button>
          </div>

          <div className="text-sm text-slate-600">
            Educational only. Prices are simulated/delayed and may not reflect live markets.
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
