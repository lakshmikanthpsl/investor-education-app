export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: "learning" | "trading" | "streak" | "milestone" | "social"
  points: number
  requirement: {
    type:
      | "lessons_completed"
      | "quiz_score"
      | "trading_profit"
      | "login_streak"
      | "documents_translated"
      | "total_points"
    value: number
    operator: "gte" | "eq" | "lte"
  }
  unlockedAt?: number
  rarity: "common" | "rare" | "epic" | "legendary"
}

export interface UserStats {
  totalPoints: number
  level: number
  experiencePoints: number
  experienceToNextLevel: number
  lessonsCompleted: number
  quizzesCompleted: number
  averageQuizScore: number
  tradingProfit: number
  documentsTranslated: number
  loginStreak: number
  longestStreak: number
  lastLoginDate: string
  joinDate: string
  achievements: string[]
  badges: string[]
}

export interface LeaderboardEntry {
  userId: string
  username: string
  points: number
  level: number
  achievements: number
  avatar?: string
}

export const achievements: Achievement[] = [
  // Learning Achievements
  {
    id: "first_lesson",
    title: "Getting Started",
    description: "Complete your first lesson",
    icon: "🎯",
    category: "learning",
    points: 50,
    requirement: { type: "lessons_completed", value: 1, operator: "gte" },
    rarity: "common",
  },
  {
    id: "lesson_master",
    title: "Lesson Master",
    description: "Complete all available lessons",
    icon: "🎓",
    category: "learning",
    points: 500,
    requirement: { type: "lessons_completed", value: 4, operator: "gte" },
    rarity: "epic",
  },
  {
    id: "quiz_ace",
    title: "Quiz Ace",
    description: "Score 90% or higher on a quiz",
    icon: "⭐",
    category: "learning",
    points: 100,
    requirement: { type: "quiz_score", value: 90, operator: "gte" },
    rarity: "rare",
  },
  {
    id: "perfect_score",
    title: "Perfect Score",
    description: "Score 100% on a quiz",
    icon: "💯",
    category: "learning",
    points: 200,
    requirement: { type: "quiz_score", value: 100, operator: "eq" },
    rarity: "epic",
  },

  // Trading Achievements
  {
    id: "first_trade",
    title: "First Trade",
    description: "Execute your first virtual trade",
    icon: "📈",
    category: "trading",
    points: 75,
    requirement: { type: "trading_profit", value: -999999, operator: "gte" },
    rarity: "common",
  },
  {
    id: "profitable_trader",
    title: "Profitable Trader",
    description: "Achieve positive returns in virtual trading",
    icon: "💰",
    category: "trading",
    points: 150,
    requirement: { type: "trading_profit", value: 0, operator: "gte" },
    rarity: "rare",
  },
  {
    id: "trading_expert",
    title: "Trading Expert",
    description: "Achieve 10% profit in virtual trading",
    icon: "🏆",
    category: "trading",
    points: 300,
    requirement: { type: "trading_profit", value: 100000, operator: "gte" },
    rarity: "epic",
  },

  // Streak Achievements
  {
    id: "consistent_learner",
    title: "Consistent Learner",
    description: "Login for 7 consecutive days",
    icon: "🔥",
    category: "streak",
    points: 200,
    requirement: { type: "login_streak", value: 7, operator: "gte" },
    rarity: "rare",
  },
  {
    id: "dedication_master",
    title: "Dedication Master",
    description: "Login for 30 consecutive days",
    icon: "💎",
    category: "streak",
    points: 1000,
    requirement: { type: "login_streak", value: 30, operator: "gte" },
    rarity: "legendary",
  },

  // Milestone Achievements
  {
    id: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Translate 5 documents",
    icon: "🌐",
    category: "milestone",
    points: 250,
    requirement: { type: "documents_translated", value: 5, operator: "gte" },
    rarity: "rare",
  },
  {
    id: "point_collector",
    title: "Point Collector",
    description: "Earn 1000 total points",
    icon: "🎖️",
    category: "milestone",
    points: 100,
    requirement: { type: "total_points", value: 1000, operator: "gte" },
    rarity: "rare",
  },
]

export class GamificationEngine {
  private static readonly LEVEL_BASE_XP = 100
  private static readonly LEVEL_MULTIPLIER = 1.5

  static calculateLevel(experiencePoints: number): { level: number; experienceToNextLevel: number } {
    let level = 1
    let totalXpForLevel = 0

    while (experiencePoints >= totalXpForLevel + this.getLevelRequirement(level)) {
      totalXpForLevel += this.getLevelRequirement(level)
      level++
    }

    const experienceToNextLevel = this.getLevelRequirement(level) - (experiencePoints - totalXpForLevel)

    return { level, experienceToNextLevel }
  }

  private static getLevelRequirement(level: number): number {
    return Math.floor(this.LEVEL_BASE_XP * Math.pow(this.LEVEL_MULTIPLIER, level - 1))
  }

  static checkAchievements(stats: UserStats): Achievement[] {
    const newAchievements: Achievement[] = []

    for (const achievement of achievements) {
      if (stats.achievements.includes(achievement.id)) continue

      const meetsRequirement = this.checkRequirement(achievement.requirement, stats)
      if (meetsRequirement) {
        newAchievements.push(achievement)
      }
    }

    return newAchievements
  }

  private static checkRequirement(requirement: Achievement["requirement"], stats: UserStats): boolean {
    let currentValue: number

    switch (requirement.type) {
      case "lessons_completed":
        currentValue = stats.lessonsCompleted
        break
      case "quiz_score":
        currentValue = stats.averageQuizScore
        break
      case "trading_profit":
        currentValue = stats.tradingProfit
        break
      case "login_streak":
        currentValue = stats.loginStreak
        break
      case "documents_translated":
        currentValue = stats.documentsTranslated
        break
      case "total_points":
        currentValue = stats.totalPoints
        break
      default:
        return false
    }

    switch (requirement.operator) {
      case "gte":
        return currentValue >= requirement.value
      case "eq":
        return currentValue === requirement.value
      case "lte":
        return currentValue <= requirement.value
      default:
        return false
    }
  }

  static calculatePoints(action: string, value?: number): number {
    const pointsMap: Record<string, number> = {
      lesson_completed: 50,
      quiz_completed: 25,
      quiz_perfect: 100,
      quiz_high_score: 75, // 90%+
      first_trade: 25,
      profitable_trade: 10,
      document_translated: 30,
      daily_login: 10,
      streak_bonus: 5, // per day in streak
    }

    const basePoints = pointsMap[action] || 0

    if (action === "streak_bonus" && value) {
      return basePoints * value
    }

    return basePoints
  }

  static getRarityColor(rarity: Achievement["rarity"]): string {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "rare":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "epic":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }
}
