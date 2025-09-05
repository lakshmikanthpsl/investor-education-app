import type { QuestionCategory } from "./questions"

export type LessonStep = {
  id: string
  type: "content" | "interactive" | "quiz" | "example"
  title: string
  content: string
  interactiveElement?: {
    type: "slider" | "calculator" | "simulation" | "drag-drop"
    config: any
  }
  quiz?: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
}

export type Lesson = {
  id: string
  title: string
  summary: string
  category: QuestionCategory
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedTime: number // in minutes
  prerequisites?: string[]
  steps: LessonStep[]
  keyTakeaways: string[]
}

export const lessons: Lesson[] = [
  {
    id: "basics-1",
    title: "Stock Market Fundamentals",
    summary: "Understand what shares represent, how markets work, and different types of orders.",
    category: "stock-basics",
    difficulty: "beginner",
    estimatedTime: 15,
    steps: [
      {
        id: "basics-1-1",
        type: "content",
        title: "What Are Stocks?",
        content:
          "Stocks represent ownership shares in a company. When you buy a stock, you become a partial owner of that business and have a claim on its assets and earnings.",
      },
      {
        id: "basics-1-2",
        type: "interactive",
        title: "Company Ownership Calculator",
        content: "Use this calculator to see how much of a company you would own based on your investment.",
        interactiveElement: {
          type: "calculator",
          config: {
            inputs: ["investment_amount", "share_price", "total_shares"],
            formula: "(investment_amount / share_price) / total_shares * 100",
          },
        },
      },
      {
        id: "basics-1-3",
        type: "content",
        title: "Primary vs Secondary Markets",
        content:
          "Primary market: Where companies first sell shares to the public (IPO). Secondary market: Where investors trade existing shares among themselves (stock exchanges like NSE, BSE).",
      },
      {
        id: "basics-1-4",
        type: "quiz",
        title: "Quick Check",
        content: "Test your understanding of market types.",
        quiz: {
          question: "Where would you buy shares of a company that went public 5 years ago?",
          options: ["Primary Market", "Secondary Market", "Both markets", "Neither market"],
          correctAnswer: 1,
          explanation:
            "Since the company already went public, you would buy existing shares from other investors in the secondary market (stock exchanges).",
        },
      },
      {
        id: "basics-1-5",
        type: "content",
        title: "Types of Orders",
        content:
          "Market Order: Buy/sell immediately at current price. Limit Order: Buy/sell only at your specified price or better. Stop-Loss Order: Sell when price drops to limit losses.",
      },
    ],
    keyTakeaways: [
      "Stocks represent ownership in companies",
      "IPOs happen in primary markets, trading happens in secondary markets",
      "Different order types serve different investment strategies",
    ],
  },
  {
    id: "risk-1",
    title: "Understanding Investment Risk",
    summary:
      "Learn about different types of risk, how to measure them, and strategies to manage risk in your portfolio.",
    category: "risk-assessment",
    difficulty: "beginner",
    estimatedTime: 20,
    prerequisites: ["basics-1"],
    steps: [
      {
        id: "risk-1-1",
        type: "content",
        title: "What is Investment Risk?",
        content:
          "Risk in investing refers to the possibility that your investment's actual returns will differ from expected returns. Higher risk typically means higher potential returns, but also higher potential losses.",
      },
      {
        id: "risk-1-2",
        type: "interactive",
        title: "Risk-Return Visualizer",
        content: "Explore how different asset classes compare in terms of risk and return.",
        interactiveElement: {
          type: "simulation",
          config: {
            type: "risk_return_chart",
            assets: ["savings_account", "bonds", "large_cap_stocks", "small_cap_stocks", "crypto"],
          },
        },
      },
      {
        id: "risk-1-3",
        type: "content",
        title: "Types of Risk",
        content:
          "Market Risk: Overall market movements. Company Risk: Specific to individual companies. Inflation Risk: Purchasing power erosion. Liquidity Risk: Difficulty selling investments.",
      },
      {
        id: "risk-1-4",
        type: "interactive",
        title: "Volatility Calculator",
        content: "Calculate the volatility of different investments to understand their risk levels.",
        interactiveElement: {
          type: "calculator",
          config: {
            type: "volatility",
            description: "Enter historical prices to calculate standard deviation",
          },
        },
      },
      {
        id: "risk-1-5",
        type: "quiz",
        title: "Risk Assessment",
        content: "Test your understanding of investment risk.",
        quiz: {
          question: "Which investment typically has the highest risk?",
          options: ["Government bonds", "Bank fixed deposits", "Large-cap stocks", "Small-cap stocks"],
          correctAnswer: 3,
          explanation:
            "Small-cap stocks typically have higher volatility and risk compared to large-cap stocks, bonds, or fixed deposits, but also offer higher potential returns.",
        },
      },
    ],
    keyTakeaways: [
      "Risk and return are generally correlated",
      "Different types of risk affect investments differently",
      "Understanding volatility helps in risk assessment",
    ],
  },
  {
    id: "algo-1",
    title: "Algorithmic Trading Basics",
    summary: "Understand how computer algorithms are used in trading and their impact on modern markets.",
    category: "algo-trading",
    difficulty: "intermediate",
    estimatedTime: 25,
    prerequisites: ["basics-1", "risk-1"],
    steps: [
      {
        id: "algo-1-1",
        type: "content",
        title: "What is Algorithmic Trading?",
        content:
          "Algorithmic trading uses computer programs to execute trades based on predefined rules and conditions. These algorithms can process market data and execute trades much faster than humans.",
      },
      {
        id: "algo-1-2",
        type: "example",
        title: "Simple Algorithm Example",
        content:
          "Example: 'Buy 100 shares of XYZ if price drops 5% below yesterday's close AND trading volume is above average.' This removes emotion and ensures consistent execution.",
      },
      {
        id: "algo-1-3",
        type: "content",
        title: "High-Frequency Trading (HFT)",
        content:
          "HFT involves executing thousands of trades per second, often holding positions for milliseconds. It requires sophisticated technology and co-location near exchange servers to minimize latency.",
      },
      {
        id: "algo-1-4",
        type: "interactive",
        title: "Order Book Simulator",
        content: "See how algorithmic orders interact with the market order book.",
        interactiveElement: {
          type: "simulation",
          config: {
            type: "order_book",
            description: "Watch how different order types affect the bid-ask spread",
          },
        },
      },
      {
        id: "algo-1-5",
        type: "quiz",
        title: "Algorithm Knowledge Check",
        content: "Test your understanding of algorithmic trading.",
        quiz: {
          question: "What is the main advantage of algorithmic trading over manual trading?",
          options: [
            "Always profitable",
            "Eliminates all risk",
            "Faster execution and removes emotion",
            "Guarantees market timing",
          ],
          correctAnswer: 2,
          explanation:
            "Algorithmic trading's main advantages are speed of execution and removing human emotions like fear and greed from trading decisions.",
        },
      },
    ],
    keyTakeaways: [
      "Algorithms execute trades based on predefined rules",
      "Speed and emotion-free execution are key advantages",
      "HFT requires sophisticated technology and infrastructure",
    ],
  },
  {
    id: "diversify-1",
    title: "Portfolio Diversification Strategies",
    summary: "Learn how to spread risk across different investments to build a more stable portfolio.",
    category: "diversification",
    difficulty: "intermediate",
    estimatedTime: 18,
    prerequisites: ["basics-1", "risk-1"],
    steps: [
      {
        id: "diversify-1-1",
        type: "content",
        title: "The Principle of Diversification",
        content:
          "Diversification means spreading your investments across different assets, sectors, and geographies to reduce overall portfolio risk. The goal is to avoid putting 'all eggs in one basket.'",
      },
      {
        id: "diversify-1-2",
        type: "interactive",
        title: "Correlation Explorer",
        content: "Understand how different assets move in relation to each other.",
        interactiveElement: {
          type: "simulation",
          config: {
            type: "correlation_matrix",
            assets: ["indian_stocks", "us_stocks", "gold", "bonds", "real_estate"],
          },
        },
      },
      {
        id: "diversify-1-3",
        type: "content",
        title: "Asset Allocation Strategies",
        content:
          "Age-based rule: 100 minus your age in stocks, rest in bonds. Risk-based: Conservative (30% stocks), Moderate (60% stocks), Aggressive (80% stocks). Geographic: Mix of domestic and international investments.",
      },
      {
        id: "diversify-1-4",
        type: "interactive",
        title: "Portfolio Builder",
        content: "Build your own diversified portfolio and see how it performs.",
        interactiveElement: {
          type: "drag-drop",
          config: {
            type: "portfolio_allocation",
            categories: ["Large Cap", "Mid Cap", "Small Cap", "Bonds", "Gold", "International"],
          },
        },
      },
      {
        id: "diversify-1-5",
        type: "quiz",
        title: "Diversification Quiz",
        content: "Test your portfolio diversification knowledge.",
        quiz: {
          question: "Which portfolio is better diversified?",
          options: [
            "100% technology stocks",
            "50% banking, 50% pharma stocks",
            "40% stocks, 30% bonds, 20% gold, 10% real estate",
            "100% government bonds",
          ],
          correctAnswer: 2,
          explanation:
            "The third option spreads risk across different asset classes (stocks, bonds, gold, real estate), providing better diversification than concentrating in single sectors or asset types.",
        },
      },
    ],
    keyTakeaways: [
      "Diversification reduces portfolio risk without eliminating returns",
      "Correlation between assets affects diversification benefits",
      "Regular rebalancing maintains desired asset allocation",
    ],
  },
  {
    id: "orders-1",
    title: "Mastering Market Orders",
    summary: "Learn about different types of trading orders and when to use each one effectively.",
    category: "market-orders",
    difficulty: "beginner",
    estimatedTime: 12,
    prerequisites: ["basics-1"],
    steps: [
      {
        id: "orders-1-1",
        type: "content",
        title: "Market Orders Explained",
        content:
          "Market orders execute immediately at the best available price. They guarantee execution but not the price you'll pay.",
      },
      {
        id: "orders-1-2",
        type: "content",
        title: "Limit Orders",
        content:
          "Limit orders let you specify the maximum price you're willing to pay (buy) or minimum price you'll accept (sell). They control price but don't guarantee execution.",
      },
      {
        id: "orders-1-3",
        type: "interactive",
        title: "Order Type Simulator",
        content: "Practice placing different order types and see how they execute in various market conditions.",
        interactiveElement: {
          type: "simulation",
          config: {
            type: "order_execution",
            scenarios: ["volatile_market", "stable_market", "trending_market"],
          },
        },
      },
      {
        id: "orders-1-4",
        type: "quiz",
        title: "Order Types Quiz",
        content: "Test your understanding of when to use different order types.",
        quiz: {
          question: "When would you use a limit order instead of a market order?",
          options: [
            "When you want immediate execution",
            "When you want to control the price you pay",
            "When the market is very liquid",
            "When you're buying small amounts",
          ],
          correctAnswer: 1,
          explanation:
            "Limit orders are best when you want to control the price, especially in volatile markets where market orders might execute at unfavorable prices.",
        },
      },
    ],
    keyTakeaways: [
      "Market orders prioritize speed, limit orders prioritize price control",
      "Stop orders help manage risk and automate trading decisions",
      "Order choice depends on market conditions and your priorities",
    ],
  },
]
