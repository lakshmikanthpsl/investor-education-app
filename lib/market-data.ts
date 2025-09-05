export type Candle = {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export type Ticker =
  | "NIFTY50"
  | "RELIANCE"
  | "TCS"
  | "INFY"
  | "HDFC"
  | "ICICIBANK"
  | "SBIN"
  | "ITC"
  | "HDFCBANK"
  | "WIPRO"

export type MarketData = {
  symbol: string
  name: string
  sector: string
  marketCap: string
  data: Candle[]
  currentPrice: number
  change: number
  changePercent: number
}

const generateRealisticSeries = (start: number, drift: number, volatility: number, days = 252): Candle[] => {
  const out: Candle[] = []
  let price = start

  for (let i = 0; i < days; i++) {
    const dailyReturn = drift + (Math.random() - 0.5) * volatility
    const newPrice = Math.max(1, price * (1 + dailyReturn))

    // Generate OHLC data
    const open = i === 0 ? price : out[i - 1].close
    const high = Math.max(open, newPrice) * (1 + Math.random() * 0.02)
    const low = Math.min(open, newPrice) * (1 - Math.random() * 0.02)
    const close = newPrice
    const volume = Math.floor(Math.random() * 1000000) + 100000

    out.push({
      date: new Date(Date.now() - (days - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      open: Number(open.toFixed(2)),
      high: Number(high.toFixed(2)),
      low: Number(low.toFixed(2)),
      close: Number(close.toFixed(2)),
      volume,
    })

    price = newPrice
  }
  return out
}

export const stocksData: Record<Ticker, MarketData> = {
  NIFTY50: {
    symbol: "NIFTY50",
    name: "Nifty 50 Index",
    sector: "Index",
    marketCap: "Index",
    data: generateRealisticSeries(22000, 0.0004, 0.015),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd",
    sector: "Oil & Gas",
    marketCap: "₹18,50,000 Cr",
    data: generateRealisticSeries(2900, 0.0006, 0.02),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    sector: "IT Services",
    marketCap: "₹14,20,000 Cr",
    data: generateRealisticSeries(3800, 0.0005, 0.018),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Limited",
    sector: "IT Services",
    marketCap: "₹7,80,000 Cr",
    data: generateRealisticSeries(1850, 0.0004, 0.019),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  HDFC: {
    symbol: "HDFC",
    name: "HDFC Bank Limited",
    sector: "Banking",
    marketCap: "₹12,40,000 Cr",
    data: generateRealisticSeries(1650, 0.0003, 0.016),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    name: "ICICI Bank Limited",
    sector: "Banking",
    marketCap: "₹8,90,000 Cr",
    data: generateRealisticSeries(1250, 0.0005, 0.017),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  SBIN: {
    symbol: "SBIN",
    name: "State Bank of India",
    sector: "Banking",
    marketCap: "₹6,20,000 Cr",
    data: generateRealisticSeries(820, 0.0004, 0.022),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  ITC: {
    symbol: "ITC",
    name: "ITC Limited",
    sector: "FMCG",
    marketCap: "₹5,80,000 Cr",
    data: generateRealisticSeries(465, 0.0002, 0.014),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Limited",
    sector: "Banking",
    marketCap: "₹12,40,000 Cr",
    data: generateRealisticSeries(1650, 0.0003, 0.016),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
  WIPRO: {
    symbol: "WIPRO",
    name: "Wipro Limited",
    sector: "IT Services",
    marketCap: "₹2,90,000 Cr",
    data: generateRealisticSeries(550, 0.0003, 0.02),
    currentPrice: 0,
    change: 0,
    changePercent: 0,
  },
}

// Calculate current prices and changes
Object.values(stocksData).forEach((stock) => {
  const data = stock.data
  const current = data[data.length - 1].close
  const previous = data[data.length - 2].close

  stock.currentPrice = current
  stock.change = current - previous
  stock.changePercent = ((current - previous) / previous) * 100
})

// Legacy export for backward compatibility
export const dataByTicker: Record<Ticker, Candle[]> = Object.fromEntries(
  Object.entries(stocksData).map(([ticker, data]) => [ticker, data.data]),
) as Record<Ticker, Candle[]>
