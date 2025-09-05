/* eslint-disable @typescript-eslint/no-explicit-any */

export const dynamic = "force-dynamic" // ensure fresh fetches in preview

// Minimal real-data adapter with graceful fallback.
// Reads ALPHAVANTAGE_API_KEY from environment and returns DAILY prices.
// If the key is missing or the upstream fails, returns a simulated series so the UI never breaks.

type OHLC = { t: string; o: number; h: number; l: number; c: number; v?: number }

function toJSON(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: { "content-type": "application/json; charset=utf-8", ...(init?.headers || {}) },
  })
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function randomWalkDaily({
  days = 60,
  start = 100,
  vol = 0.02,
}: { days?: number; start?: number; vol?: number }): OHLC[] {
  let price = start
  const series: OHLC[] = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const drift = (Math.random() - 0.5) * vol
    const open = price
    const close = clamp(open * (1 + drift), 1, Number.MAX_SAFE_INTEGER)
    const high = Math.max(open, close) * (1 + Math.abs(drift) * 0.6)
    const low = Math.min(open, close) * (1 - Math.abs(drift) * 0.6)
    price = close
    series.push({
      t: d.toISOString().slice(0, 10),
      o: Number(open.toFixed(2)),
      h: Number(high.toFixed(2)),
      l: Number(low.toFixed(2)),
      c: Number(close.toFixed(2)),
      v: Math.round(1_000_000 * (1 + Math.random() * 0.2)),
    })
  }
  return series
}

async function fetchAlphaDaily(symbol: string) {
  const key = process.env.ALPHAVANTAGE_API_KEY
  if (!key) {
    return {
      source: "offline-sim",
      note: "ALPHAVANTAGE_API_KEY not set; returning simulated data.",
      symbol,
      series: randomWalkDaily({ days: 60, start: 100 }),
    }
  }

  const url = new URL("https://www.alphavantage.co/query")
  url.searchParams.set("function", "TIME_SERIES_DAILY")
  url.searchParams.set("symbol", symbol)
  url.searchParams.set("apikey", key)

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) {
    return {
      source: "offline-sim",
      note: `Upstream error ${res.status}; returning simulated data.`,
      symbol,
      series: randomWalkDaily({ days: 60, start: 100 }),
    }
  }
  const json: any = await res.json()

  const daily = json["Time Series (Daily)"]
  if (!daily || typeof daily !== "object") {
    return {
      source: "offline-sim",
      note: "Unexpected upstream payload; returning simulated data.",
      symbol,
      series: randomWalkDaily({ days: 60, start: 100 }),
    }
  }

  const series: OHLC[] = Object.entries(daily)
    .map(([date, ohlc]: [string, any]) => ({
      t: date,
      o: Number(ohlc["1. open"]),
      h: Number(ohlc["2. high"]),
      l: Number(ohlc["3. low"]),
      c: Number(ohlc["4. close"]),
      v: Number(ohlc["5. volume"] ?? 0),
    }))
    .sort((a, b) => (a.t < b.t ? -1 : 1)) // ascending by date

  return { source: "alphavantage", symbol, series }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    // Note: Alpha Vantage uses US-style symbols by default. For Indian markets, try "RELIANCE.BSE" or "TCS.BSE".
    const symbol = (searchParams.get("symbol") || "AAPL").toUpperCase()
    // Optional: you can later support provider=... and range=... if needed.
    const data = await fetchAlphaDaily(symbol)
    return toJSON(data, { status: 200 })
  } catch (err: any) {
    return toJSON(
      {
        source: "offline-sim",
        note: `Runtime error: ${err?.message || "unknown"}. Returning simulated data.`,
        symbol: "AAPL",
        series: randomWalkDaily({ days: 60, start: 100 }),
      },
      { status: 200 },
    )
  }
}
