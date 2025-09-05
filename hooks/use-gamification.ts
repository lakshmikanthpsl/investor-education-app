"use client"

import { create } from "zustand"
import { GamificationEngine, type UserStats, type Achievement } from "@/lib/gamification"

interface GamificationState extends UserStats {
  updateStats: (updates: Partial<UserStats>) => void
  addPoints: (points: number, source: string) => void
  completeLesson: (lessonId: string) => void
  completeQuiz: (quizId: string, score: number) => void
  updateTradingProfit: (profit: number) => void
  translateDocument: () => void
  recordLogin: () => void
  getNewAchievements: () => Achievement[]
  resetProgress: () => void
}

const STORAGE_KEY = "investor-edu-gamification"

function loadGamificationData(): UserStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultStats()
    const data = JSON.parse(raw)

    // Ensure all required fields exist
    return {
      ...getDefaultStats(),
      ...data,
      lastLoginDate: data.lastLoginDate || new Date().toISOString().split("T")[0],
    }
  } catch {
    return getDefaultStats()
  }
}

function getDefaultStats(): UserStats {
  const today = new Date().toISOString().split("T")[0]
  return {
    totalPoints: 0,
    level: 1,
    experiencePoints: 0,
    experienceToNextLevel: 100,
    lessonsCompleted: 0,
    quizzesCompleted: 0,
    averageQuizScore: 0,
    tradingProfit: 0,
    documentsTranslated: 0,
    loginStreak: 1,
    longestStreak: 1,
    lastLoginDate: today,
    joinDate: today,
    achievements: [],
    badges: [],
  }
}

function saveGamificationData(data: UserStats) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (error) {
    console.error("Failed to save gamification data:", error)
  }
}

export const useGamification = create<GamificationState>((set, get) => ({
  ...getDefaultStats(),

  updateStats: (updates) => {
    const currentStats = get()
    const newStats = { ...currentStats, ...updates }

    // Recalculate level based on experience points
    const { level, experienceToNextLevel } = GamificationEngine.calculateLevel(newStats.experiencePoints)
    newStats.level = level
    newStats.experienceToNextLevel = experienceToNextLevel

    saveGamificationData(newStats)
    set(newStats)
  },

  addPoints: (points, source) => {
    const currentStats = get()
    const newExperiencePoints = currentStats.experiencePoints + points
    const newTotalPoints = currentStats.totalPoints + points

    get().updateStats({
      experiencePoints: newExperiencePoints,
      totalPoints: newTotalPoints,
    })
  },

  completeLesson: (lessonId) => {
    const currentStats = get()
    const points = GamificationEngine.calculatePoints("lesson_completed")

    get().updateStats({
      lessonsCompleted: currentStats.lessonsCompleted + 1,
    })

    get().addPoints(points, `lesson_${lessonId}`)
  },

  completeQuiz: (quizId, score) => {
    const currentStats = get()
    let points = GamificationEngine.calculatePoints("quiz_completed")

    // Bonus points for high scores
    if (score === 100) {
      points += GamificationEngine.calculatePoints("quiz_perfect")
    } else if (score >= 90) {
      points += GamificationEngine.calculatePoints("quiz_high_score")
    }

    // Update average quiz score
    const totalQuizzes = currentStats.quizzesCompleted + 1
    const newAverageScore = (currentStats.averageQuizScore * currentStats.quizzesCompleted + score) / totalQuizzes

    get().updateStats({
      quizzesCompleted: totalQuizzes,
      averageQuizScore: Math.round(newAverageScore),
    })

    get().addPoints(points, `quiz_${quizId}`)
  },

  updateTradingProfit: (profit) => {
    const currentStats = get()
    let points = 0

    // Award points for profitable trades
    if (profit > currentStats.tradingProfit && profit > 0) {
      points = GamificationEngine.calculatePoints("profitable_trade")
    }

    get().updateStats({
      tradingProfit: profit,
    })

    if (points > 0) {
      get().addPoints(points, "trading_profit")
    }
  },

  translateDocument: () => {
    const currentStats = get()
    const points = GamificationEngine.calculatePoints("document_translated")

    get().updateStats({
      documentsTranslated: currentStats.documentsTranslated + 1,
    })

    get().addPoints(points, "document_translation")
  },

  recordLogin: () => {
    const currentStats = get()
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0]

    let newStreak = 1
    let points = GamificationEngine.calculatePoints("daily_login")

    if (currentStats.lastLoginDate === yesterday) {
      // Consecutive day
      newStreak = currentStats.loginStreak + 1
      points += GamificationEngine.calculatePoints("streak_bonus", newStreak)
    } else if (currentStats.lastLoginDate !== today) {
      // Streak broken or first login
      newStreak = 1
    } else {
      // Already logged in today
      return
    }

    get().updateStats({
      loginStreak: newStreak,
      longestStreak: Math.max(currentStats.longestStreak, newStreak),
      lastLoginDate: today,
    })

    get().addPoints(points, "daily_login")
  },

  getNewAchievements: () => {
    const currentStats = get()
    const newAchievements = GamificationEngine.checkAchievements(currentStats)

    if (newAchievements.length > 0) {
      const newAchievementIds = newAchievements.map((a) => a.id)
      const totalAchievementPoints = newAchievements.reduce((sum, a) => sum + a.points, 0)

      get().updateStats({
        achievements: [...currentStats.achievements, ...newAchievementIds],
      })

      get().addPoints(totalAchievementPoints, "achievements")
    }

    return newAchievements
  },

  resetProgress: () => {
    const defaultStats = getDefaultStats()
    saveGamificationData(defaultStats)
    set(defaultStats)
  },
}))

// Initialize from localStorage on first load
if (typeof window !== "undefined") {
  const savedData = loadGamificationData()
  useGamification.setState(savedData)

  // Record login on app start
  useGamification.getState().recordLogin()
}
