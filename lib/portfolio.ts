export interface Position {
  symbol: string
  quantity: number
  averagePrice: number
  currentPrice: number
  marketValue: number
  unrealizedPnL: number
  unrealizedPnLPercent: number
}

export interface Trade {
  id: string
  symbol: string
  side: "BUY" | "SELL"
  quantity: number
  price: number
  timestamp: number
  value: number
}

export interface Portfolio {
  cash: number
  totalValue: number
  totalInvested: number
  totalPnL: number
  totalPnLPercent: number
  positions: Position[]
  trades: Trade[]
}

export class PortfolioManager {
  private portfolio: Portfolio

  constructor(initialCash = 1000000) {
    this.portfolio = {
      cash: initialCash,
      totalValue: initialCash,
      totalInvested: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      positions: [],
      trades: [],
    }
  }

  executeTrade(symbol: string, side: "BUY" | "SELL", quantity: number, price: number): boolean {
    const value = quantity * price
    const brokerage = this.calculateBrokerage(value)
    const totalCost = value + brokerage

    if (side === "BUY") {
      if (this.portfolio.cash < totalCost) {
        return false // Insufficient funds
      }

      this.portfolio.cash -= totalCost
      this.updatePosition(symbol, quantity, price)
    } else {
      const position = this.portfolio.positions.find((p) => p.symbol === symbol)
      if (!position || position.quantity < quantity) {
        return false // Insufficient shares
      }

      this.portfolio.cash += value - brokerage
      this.updatePosition(symbol, -quantity, price)
    }

    // Record trade
    const trade: Trade = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symbol,
      side,
      quantity,
      price,
      timestamp: Date.now(),
      value,
    }

    this.portfolio.trades.unshift(trade)
    this.calculatePortfolioMetrics()
    return true
  }

  private updatePosition(symbol: string, quantity: number, price: number) {
    const existingPosition = this.portfolio.positions.find((p) => p.symbol === symbol)

    if (!existingPosition) {
      if (quantity > 0) {
        this.portfolio.positions.push({
          symbol,
          quantity,
          averagePrice: price,
          currentPrice: price,
          marketValue: quantity * price,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
        })
      }
    } else {
      const newQuantity = existingPosition.quantity + quantity

      if (newQuantity === 0) {
        // Remove position if quantity becomes zero
        this.portfolio.positions = this.portfolio.positions.filter((p) => p.symbol !== symbol)
      } else if (newQuantity > 0) {
        // Update average price only for buy orders
        if (quantity > 0) {
          const totalValue = existingPosition.quantity * existingPosition.averagePrice + quantity * price
          existingPosition.averagePrice = totalValue / newQuantity
        }
        existingPosition.quantity = newQuantity
      }
    }
  }

  updateMarketPrices(prices: Record<string, number>) {
    this.portfolio.positions.forEach((position) => {
      if (prices[position.symbol]) {
        position.currentPrice = prices[position.symbol]
        position.marketValue = position.quantity * position.currentPrice
        position.unrealizedPnL = position.marketValue - position.quantity * position.averagePrice
        position.unrealizedPnLPercent = (position.unrealizedPnL / (position.quantity * position.averagePrice)) * 100
      }
    })
    this.calculatePortfolioMetrics()
  }

  private calculatePortfolioMetrics() {
    const totalMarketValue = this.portfolio.positions.reduce((sum, pos) => sum + pos.marketValue, 0)
    this.portfolio.totalValue = this.portfolio.cash + totalMarketValue

    const totalInvested = this.portfolio.positions.reduce((sum, pos) => sum + pos.quantity * pos.averagePrice, 0)
    this.portfolio.totalInvested = totalInvested

    this.portfolio.totalPnL = this.portfolio.positions.reduce((sum, pos) => sum + pos.unrealizedPnL, 0)
    this.portfolio.totalPnLPercent = totalInvested > 0 ? (this.portfolio.totalPnL / totalInvested) * 100 : 0
  }

  private calculateBrokerage(value: number): number {
    // Simplified brokerage calculation (0.1% or ₹20, whichever is lower)
    return Math.min(value * 0.001, 20)
  }

  getPortfolio(): Portfolio {
    return { ...this.portfolio }
  }

  reset(initialCash = 1000000) {
    this.portfolio = {
      cash: initialCash,
      totalValue: initialCash,
      totalInvested: 0,
      totalPnL: 0,
      totalPnLPercent: 0,
      positions: [],
      trades: [],
    }
  }
}
