"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, RefreshCw } from "lucide-react"
import { stocksData, type Ticker } from "@/lib/market-data"
import { PortfolioManager } from "@/lib/portfolio"
import { StockChart } from "./stock-chart"
import { PositionsTable } from "./positions-table"
import { TradeHistory } from "./trade-history"
import { useLanguage } from "@/contexts/language-context"

export function AdvancedTradingSimulator() {
  const [portfolioManager] = useState(() => new PortfolioManager(1000000))
  const [portfolio, setPortfolio] = useState(portfolioManager.getPortfolio())
  const [selectedStock, setSelectedStock] = useState<Ticker>("RELIANCE")
  const [quantity, setQuantity] = useState(10)
  const [orderType, setOrderType] = useState<"MARKET" | "LIMIT">("MARKET")
  const [limitPrice, setLimitPrice] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const currentStock = stocksData[selectedStock]
  const currentPrice = currentStock.currentPrice

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      const prices: Record<string, number> = {}
      Object.entries(stocksData).forEach(([symbol, stock]) => {
        // Simulate small price movements
        const change = (Math.random() - 0.5) * 0.02 // ±1% max change
        const newPrice = Math.max(1, stock.currentPrice * (1 + change))
        stock.currentPrice = newPrice
        prices[symbol] = newPrice
      })

      portfolioManager.updateMarketPrices(prices)
      setPortfolio(portfolioManager.getPortfolio())
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [portfolioManager])

  const executeTrade = async (side: "BUY" | "SELL") => {
    setIsLoading(true)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const price = orderType === "MARKET" ? currentPrice : Number.parseFloat(limitPrice) || currentPrice
    const success = portfolioManager.executeTrade(selectedStock, side, quantity, price)

    if (success) {
      setPortfolio(portfolioManager.getPortfolio())
    } else {
      alert(side === "BUY" ? "Insufficient funds!" : "Insufficient shares!")
    }

    setIsLoading(false)
  }

  const resetPortfolio = () => {
    portfolioManager.reset()
    setPortfolio(portfolioManager.getPortfolio())
  }

  const marketValue = useMemo(() => {
    return portfolio.positions.reduce((sum, pos) => sum + pos.marketValue, 0)
  }, [portfolio.positions])

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Total Value</span>
            </div>
            <div className="text-xl font-semibold">
              ₹{portfolio.totalValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Cash</span>
            </div>
            <div className="text-xl font-semibold">
              ₹{portfolio.cash.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-slate-600" />
              <span className="text-sm text-slate-600">Invested</span>
            </div>
            <div className="text-xl font-semibold">
              ₹{marketValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {portfolio.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm text-slate-600">P&L</span>
            </div>
            <div className={`text-xl font-semibold ${portfolio.totalPnL >= 0 ? "text-emerald-600" : "text-red-600"}`}>
              ₹{portfolio.totalPnL.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              <span className="text-sm ml-1">
                ({portfolio.totalPnLPercent >= 0 ? "+" : ""}
                {portfolio.totalPnLPercent.toFixed(2)}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trade" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="trade" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Stock Selection & Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Stock Chart</CardTitle>
                  <Select value={selectedStock} onValueChange={(value) => setSelectedStock(value as Ticker)}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(stocksData).map(([symbol, stock]) => (
                        <SelectItem key={symbol} value={symbol}>
                          {symbol}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{currentStock.name}</h3>
                      <p className="text-sm text-slate-600">{currentStock.sector}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-semibold">₹{currentPrice.toFixed(2)}</div>
                      <div
                        className={`text-sm flex items-center gap-1 ${currentStock.changePercent >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        {currentStock.changePercent >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {currentStock.changePercent >= 0 ? "+" : ""}
                        {currentStock.changePercent.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  <StockChart data={currentStock.data} />
                </div>
              </CardContent>
            </Card>

            {/* Trading Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Place Order</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Order Type</label>
                    <Select value={orderType} onValueChange={(value) => setOrderType(value as "MARKET" | "LIMIT")}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MARKET">Market Order</SelectItem>
                        <SelectItem value="LIMIT">Limit Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Quantity</label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    />
                  </div>

                  {orderType === "LIMIT" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Limit Price</label>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder={currentPrice.toFixed(2)}
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(e.target.value)}
                      />
                    </div>
                  )}

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span>Order Value:</span>
                      <span className="font-medium">
                        ₹
                        {(
                          (orderType === "LIMIT" ? Number.parseFloat(limitPrice) || currentPrice : currentPrice) *
                          quantity
                        ).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => executeTrade("BUY")}
                      disabled={isLoading}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Buy"}
                    </Button>
                    <Button
                      onClick={() => executeTrade("SELL")}
                      disabled={isLoading}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : "Sell"}
                    </Button>
                  </div>

                  <Button variant="outline" onClick={resetPortfolio} className="w-full bg-transparent">
                    Reset Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="portfolio">
          <PositionsTable positions={portfolio.positions} />
        </TabsContent>

        <TabsContent value="history">
          <TradeHistory trades={portfolio.trades} />
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-slate-600">Portfolio analysis features coming soon...</div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-slate-600 text-center">
        Educational simulation only. Prices are delayed/simulated and not for actual trading.
      </div>
    </div>
  )
}
