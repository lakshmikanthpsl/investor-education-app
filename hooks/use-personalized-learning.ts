"use client"

import { create } from "zustand"
import {
  type PersonalizedLearningData,
  PersonalizedLearningEngine,
  type TopicProficiency,
} from "@/lib/personalized-learning"
import type { QuestionCategory } from "@/lib/questions"

type PersonalizedLearningState = PersonalizedLearningData & {
  updateTopicProficiency: (
    category: QuestionCategory,
    quizResults: Array<{ questionIndex: number; correct: boolean }>,
  ) => void
  dismissRecommendation: (recommendationId: string) => void
  completeRecommendation: (recommendationId: string) => void
  refreshRecommendations: () => void
  updateLearningStreak: () => void
}

const STORAGE_KEY = "personalized-learning-data"

function loadPersonalizedData(): PersonalizedLearningData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return getDefaultData()
    return JSON.parse(raw)
  } catch {
    return getDefaultData()
  }
}

function getDefaultData(): PersonalizedLearningData {
  return {
    topicProficiencies: {} as Record<QuestionCategory, TopicProficiency>,
    recommendations: [],
    learningStreak: 0,
    lastActivityDate: null,
  }
}

function savePersonalizedData(data: PersonalizedLearningData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export const usePersonalizedLearning = create<PersonalizedLearningState>((set, get) => ({
  ...getDefaultData(),

  updateTopicProficiency: (category, quizResults) => {
    const state = get()
    const proficiency = PersonalizedLearningEngine.calculateTopicProficiency(category, quizResults)

    const newProficiencies = {
      ...state.topicProficiencies,
      [category]: proficiency,
    }

    const newData = {
      ...state,
      topicProficiencies: newProficiencies,
      lastActivityDate: new Date().toISOString(),
    }

    savePersonalizedData(newData)
    set(newData)

    // Refresh recommendations after updating proficiency
    setTimeout(() => get().refreshRecommendations(), 0)
  },

  dismissRecommendation: (recommendationId) => {
    const state = get()
    const updatedRecommendations = state.recommendations.map((rec) =>
      rec.id === recommendationId ? { ...rec, dismissed: true } : rec,
    )

    const newData = { ...state, recommendations: updatedRecommendations }
    savePersonalizedData(newData)
    set(newData)
  },

  completeRecommendation: (recommendationId) => {
    const state = get()
    const updatedRecommendations = state.recommendations.map((rec) =>
      rec.id === recommendationId ? { ...rec, completed: true } : rec,
    )

    const newData = {
      ...state,
      recommendations: updatedRecommendations,
      lastActivityDate: new Date().toISOString(),
    }
    savePersonalizedData(newData)
    set(newData)
  },

  refreshRecommendations: () => {
    const state = get()

    // Get completed lessons from progress store
    const progressData = JSON.parse(localStorage.getItem("investor-edu-progress") || '{"completedLessons": []}')
    const completedLessons = progressData.completedLessons || []

    // Get dismissed recommendations
    const dismissedRecommendations = state.recommendations.filter((rec) => rec.dismissed).map((rec) => rec.id)

    const newRecommendations = PersonalizedLearningEngine.generateRecommendations(
      state.topicProficiencies,
      completedLessons,
      dismissedRecommendations,
    )

    const newData = { ...state, recommendations: newRecommendations }
    savePersonalizedData(newData)
    set(newData)
  },

  updateLearningStreak: () => {
    const state = get()
    const newStreak = PersonalizedLearningEngine.calculateLearningStreak(state.lastActivityDate)

    const newData = {
      ...state,
      learningStreak: newStreak,
      lastActivityDate: new Date().toISOString(),
    }
    savePersonalizedData(newData)
    set(newData)
  },
}))

// Hydrate from localStorage on client
if (typeof window !== "undefined") {
  const initialData = loadPersonalizedData()
  usePersonalizedLearning.setState(initialData)
}
