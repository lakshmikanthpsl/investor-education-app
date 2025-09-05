export type QuestionCategory = "stock-basics" | "risk-assessment" | "algo-trading" | "diversification" | "market-orders"

export type Question = {
  text: string
  options: string[]
  answer: number
  category: QuestionCategory
  difficulty: "beginner" | "intermediate" | "advanced"
}

export const questionCategories: Record<QuestionCategory, { name: string; description: string }> = {
  "stock-basics": { name: "Stock Basics", description: "Fundamental concepts of stock ownership and markets" },
  "risk-assessment": { name: "Risk Assessment", description: "Understanding and managing investment risks" },
  "algo-trading": { name: "Algorithmic Trading", description: "Advanced trading concepts and algorithms" },
  diversification: { name: "Diversification", description: "Portfolio diversification strategies" },
  "market-orders": { name: "Market Orders", description: "Different types of trading orders" },
}

export const questions: Question[] = [
  {
    text: "What does owning a share represent?",
    options: ["A loan to the company", "Ownership in the company", "A guaranteed dividend", "A fixed interest payment"],
    answer: 1,
    category: "stock-basics",
    difficulty: "beginner",
  },
  {
    text: "Which order type executes immediately at the best available price?",
    options: ["Limit order", "Stop order", "Market order", "Trailing stop"],
    answer: 2,
    category: "market-orders",
    difficulty: "beginner",
  },
  {
    text: "Diversification primarily helps reduce which type of risk?",
    options: ["Systematic risk", "Idiosyncratic risk", "Interest rate risk", "Inflation risk"],
    answer: 1,
    category: "diversification",
    difficulty: "intermediate",
  },
  {
    text: "In algo/HFT contexts, what is VWAP?",
    options: [
      "Volatility Weighted Average Price",
      "Volume Weighted Average Price",
      "Variable Weighted Ask Price",
      "Valuation With Adjusted Premium",
    ],
    answer: 1,
    category: "algo-trading",
    difficulty: "advanced",
  },
  {
    text: "What does a drawdown measure?",
    options: [
      "Average daily return",
      "Peak-to-trough decline",
      "Volatility of intraday prices",
      "Dividend growth rate",
    ],
    answer: 1,
    category: "risk-assessment",
    difficulty: "intermediate",
  },
]
