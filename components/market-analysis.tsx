"use client"

import { useMemo, useState } from "react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts"
import { annualizedVol, ema, macd, maxDrawdown, rsi, sma } from "@/lib/analysis"

type Point = {
  t: string
  close: number
  sma20?: number | null
  ema12?: number | null
  rsi14?: number | null
  macd?: number | null
  signal?: number | null
  hist?: number | null
}

const SYMBOLS = ["NIFTY50", "RELIANCE", "TCS", "HDFCBANK"]
const DAY_OPTIONS = [
  { label: "1M", days: 30 },
  { label: "3M", days: 90 },
  { label: "6M", days: 180 },
]

// Deterministic RNG for repeatable series (seeded by symbol + days)
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
function hashStr(s: string) {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h *= 16777619
  }
  return h >>> 0
}
function genSeries(symbol: string, days: number): Point[] {
  const seed = hashStr(`${symbol}:${days}`)
  const rnd = mulberry32(seed)
  const start = 100 + (hashStr(symbol) % 50)
  const vol = 0.012 + (hashStr(symbol) % 7) / 1000 // ~1.2%-1.9% daily
  let price = start
  const out: Point[] = []
  const now = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(now.getDate() - i)
    const shock = (rnd() - 0.5) * 2 * vol
    const drift = 0.0002 // small positive drift
    price = Math.max(10, price * (1 + drift + shock))
    out.push({ t: d.toISOString().slice(0, 10), close: Number(price.toFixed(2)) })
  }
  return out
}

function formatPct(x: number) {
  return `${(x * 100).toFixed(2)}%`
}

export default function MarketAnalysis() {
  const [symbol, setSymbol] = useState(SYMBOLS[0])
  const [days, setDays] = useState(DAY_OPTIONS[1].days)

  const base = useMemo(() => genSeries(symbol, days), [symbol, days])
  const closes = base.map((p) => p.close)

  const withIndicators = useMemo(() => {
    const s20 = sma(closes, 20)
    const e12 = ema(closes, 12)
    const r14 = rsi(closes, 14)
    const { macdLine, signalLine, histogram } = macd(closes, 12, 26, 9)
    return base.map((p, i) => ({
      ...p,
      sma20: s20[i],
      ema12: e12[i],
      rsi14: r14[i],
      macd: macdLine[i],
      signal: signalLine[i],
      hist: histogram[i],
    }))
  }, [base, closes])

  const vol = annualizedVol(closes)
  const mdd = maxDrawdown(closes)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 className="text-xl font-semibold text-slate-900 md:text-2xl">
          Market analysis
          <span className="ml-2 text-sky-600">({symbol})</span>
        </h2>
        <div className="flex gap-2">
          <select
            aria-label="Symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            {SYMBOLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            aria-label="Time range"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-600"
          >
            {DAY_OPTIONS.map((o) => (
              <option key={o.days} value={o.days}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Volatility (annualized)</div>
          <div className="text-lg font-semibold text-slate-900">{formatPct(vol)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Max drawdown</div>
          <div className={`text-lg font-semibold ${mdd > 0.25 ? "text-red-600" : "text-emerald-600"}`}>
            {formatPct(mdd)}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Current price</div>
          <div className="text-lg font-semibold text-slate-900">₹{withIndicators.at(-1)?.close?.toFixed(2)}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <div className="text-xs text-slate-500">Trend (SMA vs EMA)</div>
          <div className="text-lg font-semibold text-slate-900">
            {(() => {
              const last = withIndicators.at(-1)
              if (!last?.sma20 || !last?.ema12) return "Neutral"
              return last.ema12 > last.sma20 ? "Bullish" : "Bearish"
            })()}
          </div>
        </div>
      </div>

      {/* Price + SMA/EMA */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-700">Price with SMA(20) & EMA(12)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={withIndicators}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="close" stroke="#0284c7" dot={false} name="Price" />
              <Line type="monotone" dataKey="sma20" stroke="#10b981" dot={false} name="SMA 20" />
              <Line type="monotone" dataKey="ema12" stroke="#0ea5e9" dot={false} name="EMA 12" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MACD */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-700">MACD(12,26,9)</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={withIndicators}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="t" hide />
              <YAxis hide />
              <Tooltip />
              <Legend />
              <Bar dataKey="hist" fill="#94a3b8" name="Histogram" />
              <Line type="monotone" dataKey="macd" stroke="#0284c7" dot={false} name="MACD" />
              <Line type="monotone" dataKey="signal" stroke="#10b981" dot={false} name="Signal" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* RSI */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-700">RSI(14)</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={withIndicators}>
              <CartesianGrid stroke="#eef2f7" />
              <XAxis dataKey="t" hide />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="rsi14" stroke="#f59e0b" dot={false} name="RSI" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Educational use only. RSI & MACD can generate false signals; combine with diversification and risk controls.
        </p>
      </div>

      {/* Sector mini-heatmap (simulated) */}
      <div className="rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="mb-3 text-sm font-medium text-slate-700">Sector snapshot (simulated)</h3>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {["Banks", "IT", "Energy", "Pharma"].map((sec, i) => {
            const seed = hashStr(sec + symbol + days)
            const rnd = mulberry32(seed)()
            const chg = (rnd - 0.5) * 0.06 // -3% to +3%
            return (
              <div key={sec} className="rounded-md border border-slate-200 p-3">
                <div className="text-xs text-slate-500">{sec}</div>
                <div className={`text-sm font-semibold ${chg >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {chg >= 0 ? "+" : "-"}
                  {Math.abs(chg * 100).toFixed(2)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
