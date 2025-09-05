"use client"

import { create } from "zustand"
import { useGamification } from "./use-gamification"

type State = {
  completedLessons: string[]
  quizScores: Record<string, number>
  toggleLesson: (id: string) => void
  setQuizScore: (id: string, score: number) => void
}

const STORAGE_KEY = "investor-edu-progress"

function load(): Pick<State, "completedLessons" | "quizScores"> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completedLessons: [], quizScores: {} }
    return JSON.parse(raw)
  } catch {
    return { completedLessons: [], quizScores: {} }
  }
}

function save(data: Pick<State, "completedLessons" | "quizScores">) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export const useProgress = create<State>((set, get) => ({
  completedLessons: [],
  quizScores: {},
  toggleLesson: (id) => {
    const { completedLessons, quizScores } = get()
    const isCompleting = !completedLessons.includes(id)
    const next = isCompleting ? [...completedLessons, id] : completedLessons.filter((x) => x !== id)

    save({ completedLessons: next, quizScores })
    set({ completedLessons: next })

    if (isCompleting && typeof window !== "undefined") {
      // Use setTimeout to ensure gamification store is available
      setTimeout(() => {
        const gamification = useGamification.getState()
        gamification.completeLesson(id)
      }, 0)
    }
  },
  setQuizScore: (id, score) => {
    const { completedLessons, quizScores } = get()
    const nextScores = { ...quizScores, [id]: score }
    save({ completedLessons, quizScores: nextScores })
    set({ quizScores: nextScores })

    if (typeof window !== "undefined") {
      setTimeout(() => {
        const gamification = useGamification.getState()
        gamification.completeQuiz(id, score)
      }, 0)
    }
  },
}))

// On first load, hydrate from localStorage
if (typeof window !== "undefined") {
  const initial = load()
  useProgress.setState(initial)
}
