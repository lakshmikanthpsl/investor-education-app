export type SeriesPoint = { t: string; close: number }

// Simple helpers
function mean(xs: number[]) {
  return xs.reduce((a, b) => a + b, 0) / (xs.length || 1)
}
function stddev(xs: number[]) {
  const m = mean(xs)
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)))
}

// Moving averages
export function sma(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  for (let i = 0; i < values.length; i++) {
    if (i + 1 < period) {
      out.push(null)
      continue
    }
    const window = values.slice(i + 1 - period, i + 1)
    out.push(mean(window))
  }
  return out
}

export function ema(values: number[], period: number): (number | null)[] {
  const out: (number | null)[] = []
  const k = 2 / (period + 1)
  let prev: number | null = null
  for (let i = 0; i < values.length; i++) {
    if (prev == null) {
      out.push(null)
      prev = values[i]
      continue
    }
    const v = values[i] * k + (prev as number) * (1 - k)
    out.push(v)
    prev = v
  }
  return out
}

// RSI
export function rsi(values: number[], period = 14): (number | null)[] {
  const out: (number | null)[] = []
  let gains = 0
  let losses = 0

  for (let i = 1; i < values.length; i++) {
    const change = values[i] - values[i - 1]
    if (i <= period) {
      if (change > 0) gains += change
      else losses -= change
      out.push(null)
      continue
    }
    const avgGain = (gains + Math.max(change, 0)) / period
    const avgLoss = (losses + Math.max(-change, 0)) / period
    const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
    const rsiVal = 100 - 100 / (1 + rs)
    out.push(rsiVal)

    // roll window
    const oldChange = values[i - period + 1] - values[i - period]
    if (oldChange > 0) gains -= oldChange
    else losses -= -oldChange
    if (change > 0) gains += change
    else losses += -change
  }
  // pad first value
  out.unshift(null)
  return out
}

// MACD
export function macd(values: number[], fast = 12, slow = 26, signal = 9) {
  const emaFast = ema(values, fast)
  const emaSlow = ema(values, slow)
  const macdLine: (number | null)[] = values.map((_, i) => {
    const f = emaFast[i]
    const s = emaSlow[i]
    if (f == null || s == null) return null
    return f - s
  })
  const macdVals = macdLine.map((v) => (v == null ? 0 : v))
  const signalLine = ema(macdVals, signal)
  const histogram: (number | null)[] = macdLine.map((v, i) => {
    const s = signalLine[i]
    if (v == null || s == null) return null
    return v - s
  })
  return { macdLine, signalLine, histogram }
}

// Risk metrics
export function annualizedVol(values: number[]): number {
  if (values.length < 2) return 0
  const returns = []
  for (let i = 1; i < values.length; i++) {
    returns.push((values[i] - values[i - 1]) / values[i - 1])
  }
  const dailyVol = stddev(returns)
  return dailyVol * Math.sqrt(252)
}

export function maxDrawdown(values: number[]): number {
  let peak = values[0] || 0
  let mdd = 0
  for (const v of values) {
    peak = Math.max(peak, v)
    const dd = (v - peak) / peak
    mdd = Math.min(mdd, dd)
  }
  return Math.abs(mdd)
}
