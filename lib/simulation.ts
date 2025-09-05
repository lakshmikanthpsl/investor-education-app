import type { Candle, Ticker } from "./market-data"

export type Trade = {
  side: "BUY" | "SELL"
  qty: number
  price: number
  ticker: Ticker
  ts: number
}

export type Portfolio = {
  cash: number
  positionQty: number
  avgCost: number
  value: number
  annualizedVolatility: number
  maxDrawdown: number
}

export function simulatePortfolio(initialCash: number, trades: Trade[], series: Candle[]): Portfolio {
  let cash = initialCash
  let positionQty = 0
  let avgCost = 0

  for (const t of trades) {
    if (t.side === "BUY") {
      cash -= t.qty * t.price
      const totalCost = avgCost * positionQty + t.qty * t.price
      positionQty += t.qty
      avgCost = positionQty > 0 ? totalCost / positionQty : 0
    } else {
      // SELL
      const sellQty = Math.min(t.qty, positionQty)
      cash += sellQty * t.price
      positionQty -= sellQty
      if (positionQty === 0) avgCost = 0
    }
  }

  const last = series[series.length - 1]?.close ?? 0
  const value = cash + positionQty * last
  const annualizedVolatility = computeVolatility(series)
  const maxDrawdown = computeMaxDrawdown(series)
  return { cash, positionQty, avgCost, value, annualizedVolatility, maxDrawdown }
}

export function computeVolatility(series: Candle[]): number {
  if (!series || series.length < 2) return 0
  const rets: number[] = []
  for (let i = 1; i < series.length; i++) {
    const prev = series[i - 1].close
    const cur = series[i].close
    if (prev > 0) rets.push((cur - prev) / prev)
  }
  if (rets.length === 0) return 0
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, b) => a + (b - mean) * (b - mean), 0) / rets.length
  const dailyStd = Math.sqrt(variance)
  const annualized = dailyStd * Math.sqrt(252)
  return Math.max(0, Number((annualized * 100).toFixed(2))) // percent
}

export function computeMaxDrawdown(series: Candle[]): number {
  if (!series || series.length === 0) return 0
  let peak = series[0].close
  let maxDD = 0
  for (let i = 1; i < series.length; i++) {
    const p = series[i].close
    peak = Math.max(peak, p)
    const dd = peak > 0 ? (p - peak) / peak : 0
    if (dd < maxDD) maxDD = dd
  }
  return Math.abs(Number((maxDD * 100).toFixed(2))) // percent drawdown as positive number
}
