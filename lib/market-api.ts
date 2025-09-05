export interface MarketSnapshot {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  high: number
  low: number
  volume?: number
  lastUpdated: string
}

export interface IndexData {
  name: string
  value: number
  change: number
  changePercent: number
  lastUpdated: string
}

// Cache for API responses (60-120 seconds)
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 90 * 1000 // 90 seconds

// Mock data fallback for when API fails
const mockIndices: IndexData[] = [
  {
    name: "NIFTY 50",
    value: 22150.45,
    change: 125.3,
    changePercent: 0.57,
    lastUpdated: new Date().toISOString(),
  },
  {
    name: "SENSEX",
    value: 73248.9,
    change: -89.45,
    changePercent: -0.12,
    lastUpdated: new Date().toISOString(),
  },
]

const mockGainers: MarketSnapshot[] = [
  {
    symbol: "ADANIPORTS",
    name: "Adani Ports",
    price: 1245.6,
    change: 67.8,
    changePercent: 5.76,
    high: 1250.0,
    low: 1180.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "TATAMOTORS",
    name: "Tata Motors",
    price: 890.25,
    change: 42.15,
    changePercent: 4.97,
    high: 895.0,
    low: 850.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance",
    price: 6780.9,
    change: 285.4,
    changePercent: 4.39,
    high: 6800.0,
    low: 6500.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "MARUTI",
    name: "Maruti Suzuki",
    price: 11250.75,
    change: 456.25,
    changePercent: 4.23,
    high: 11280.0,
    low: 10800.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "SUNPHARMA",
    name: "Sun Pharma",
    price: 1680.4,
    change: 65.9,
    changePercent: 4.08,
    high: 1685.0,
    low: 1620.0,
    lastUpdated: new Date().toISOString(),
  },
]

const mockLosers: MarketSnapshot[] = [
  {
    symbol: "COALINDIA",
    name: "Coal India",
    price: 385.2,
    change: -18.75,
    changePercent: -4.64,
    high: 405.0,
    low: 380.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "ONGC",
    name: "ONGC",
    price: 245.8,
    change: -11.4,
    changePercent: -4.43,
    high: 260.0,
    low: 242.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "NTPC",
    name: "NTPC",
    price: 325.65,
    change: -14.25,
    changePercent: -4.19,
    high: 342.0,
    low: 320.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "POWERGRID",
    name: "Power Grid",
    price: 285.9,
    change: -11.8,
    changePercent: -3.96,
    high: 300.0,
    low: 282.0,
    lastUpdated: new Date().toISOString(),
  },
  {
    symbol: "DRREDDY",
    name: "Dr Reddy's",
    price: 5890.45,
    change: -225.55,
    changePercent: -3.69,
    high: 6120.0,
    low: 5850.0,
    lastUpdated: new Date().toISOString(),
  },
]

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  return null
}

function setCachedData(key: string, data: any) {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function getIndicesData(): Promise<IndexData[]> {
  const cacheKey = "indices"
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // In a real implementation, you would call Alpha Vantage or NSE API here
    // For now, we'll simulate with mock data with slight variations
    const indices = mockIndices.map((index) => ({
      ...index,
      value: index.value + (Math.random() - 0.5) * 100,
      change: (Math.random() - 0.5) * 200,
      changePercent: (Math.random() - 0.5) * 2,
      lastUpdated: new Date().toISOString(),
    }))

    setCachedData(cacheKey, indices)
    return indices
  } catch (error) {
    console.error("Failed to fetch indices data:", error)
    return mockIndices
  }
}

export async function getTopMovers(): Promise<{ gainers: MarketSnapshot[]; losers: MarketSnapshot[] }> {
  const cacheKey = "movers"
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // Simulate slight price variations for mock data
    const gainers = mockGainers.map((stock) => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 20,
      change: stock.change + (Math.random() - 0.5) * 10,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 1,
      lastUpdated: new Date().toISOString(),
    }))

    const losers = mockLosers.map((stock) => ({
      ...stock,
      price: stock.price + (Math.random() - 0.5) * 20,
      change: stock.change + (Math.random() - 0.5) * 5,
      changePercent: stock.changePercent + (Math.random() - 0.5) * 1,
      lastUpdated: new Date().toISOString(),
    }))

    const result = { gainers, losers }
    setCachedData(cacheKey, result)
    return result
  } catch (error) {
    console.error("Failed to fetch top movers:", error)
    return { gainers: mockGainers, losers: mockLosers }
  }
}

export async function searchStock(symbol: string): Promise<MarketSnapshot | null> {
  const cacheKey = `stock_${symbol}`
  const cached = getCachedData(cacheKey)
  if (cached) return cached

  try {
    // In a real implementation, you would call Alpha Vantage API here
    // For now, simulate a stock search result
    const mockStock: MarketSnapshot = {
      symbol: symbol.toUpperCase(),
      name: `${symbol.toUpperCase()} Limited`,
      price: Math.random() * 1000 + 100,
      change: (Math.random() - 0.5) * 50,
      changePercent: (Math.random() - 0.5) * 10,
      high: Math.random() * 1000 + 150,
      low: Math.random() * 1000 + 50,
      volume: Math.floor(Math.random() * 1000000) + 100000,
      lastUpdated: new Date().toISOString(),
    }

    setCachedData(cacheKey, mockStock)
    return mockStock
  } catch (error) {
    console.error("Failed to search stock:", error)
    return null
  }
}

// Market trivia for educational content
export const marketTrivia = [
  "Did you know? The BSE (Bombay Stock Exchange) is Asia's oldest stock exchange, established in 1875.",
  "The NIFTY 50 represents the weighted average of 50 of the largest Indian companies listed on the NSE.",
  "Market cap is calculated by multiplying the current stock price by the total number of outstanding shares.",
  "A bull market is when stock prices are rising, while a bear market is when they're falling.",
  "The term 'Blue Chip' comes from poker, where blue chips have the highest value.",
  "Sensex stands for 'Sensitive Index' and tracks 30 well-established companies on the BSE.",
  "Volume indicates how many shares were traded - higher volume often means stronger price movements.",
]

export function getTodaysTrivia(): string {
  const today = new Date().getDate()
  return marketTrivia[today % marketTrivia.length]
}
