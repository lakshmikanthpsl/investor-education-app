"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUp, TrendingDown, RefreshCw, Search, Info } from "lucide-react"
import { getIndicesData, getTopMovers, searchStock, getTodaysTrivia, type IndexData } from "@/lib/market-api"

export function MarketSnapshot() {
  const [indices, setIndices] = useState<IndexData[]>([])
  const [movers, setMovers] = useState<{ gainers: any[]; losers: any[] }>({ gainers: [], losers: [] })
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResult, setSearchResult] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      const [indicesData, moversData] = await Promise.all([getIndicesData(), getTopMovers()])
      setIndices(indicesData)
      setMovers(moversData)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to load market data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsLoading(true)
    try {
      const result = await searchStock(searchQuery.trim())
      setSearchResult(result)
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMarketData()
    // Auto-refresh every 2 minutes
    const interval = setInterval(loadMarketData, 120000)
    return () => clearInterval(interval)
  }, [])

  const formatPrice = (price: number) => `₹${price.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`
  const formatChange = (change: number, percent: number) => {
    const isPositive = change >= 0
    return (
      <span className={`flex items-center gap-1 ${isPositive ? "text-emerald-600" : "text-red-600"}`}>
        {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isPositive ? "+" : ""}
        {change.toFixed(2)} ({isPositive ? "+" : ""}
        {percent.toFixed(2)}%)
      </span>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">📈 Market Snapshot</CardTitle>
          <Button variant="outline" size="sm" onClick={loadMarketData} disabled={isLoading} className="bg-white/60">
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        <p className="text-sm text-slate-600">Last updated: {lastUpdated.toLocaleTimeString("en-IN")}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Indices */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Major Indices</h4>
          <div className="grid gap-2">
            {indices.map((index) => (
              <div key={index.name} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <span className="font-medium text-sm">{index.name}</span>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(index.value)}</div>
                  <div className="text-xs">{formatChange(index.change, index.changePercent)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Search */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Search Stocks</h4>
          <div className="flex gap-2">
            <Input
              placeholder="Enter stock symbol (e.g., RELIANCE)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-white/60"
            />
            <Button onClick={handleSearch} disabled={isLoading} size="sm">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          {searchResult && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="font-semibold">{searchResult.symbol}</div>
                  <div className="text-sm text-slate-600">{searchResult.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatPrice(searchResult.price)}</div>
                  <div className="text-xs">{formatChange(searchResult.change, searchResult.changePercent)}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-xs text-slate-600">
                <div>High: {formatPrice(searchResult.high)}</div>
                <div>Low: {formatPrice(searchResult.low)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Top Movers */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-emerald-600">Top Gainers</h4>
            <div className="space-y-1">
              {movers.gainers.slice(0, 3).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between text-xs p-2 bg-emerald-50 rounded">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-emerald-600">+{stock.changePercent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-red-600">Top Losers</h4>
            <div className="space-y-1">
              {movers.losers.slice(0, 3).map((stock) => (
                <div key={stock.symbol} className="flex items-center justify-between text-xs p-2 bg-red-50 rounded">
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-red-600">{stock.changePercent.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Trivia */}
        <div className="p-3 bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg border border-blue-200">
          <div className="flex items-start gap-2">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-sm text-blue-900 mb-1">Did You Know?</div>
              <div className="text-xs text-blue-800 leading-relaxed">{getTodaysTrivia()}</div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="text-xs text-slate-500 text-center p-2 bg-slate-50 rounded">
          <Badge variant="outline" className="mb-1">
            Educational Use Only
          </Badge>
          <div>Data is delayed and for educational purposes only. Not for actual trading decisions.</div>
        </div>
      </CardContent>
    </Card>
  )
}
