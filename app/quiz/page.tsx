"use client"

import { QuizEngine } from "@/components/quiz-engine"

export default function QuizPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-balance">Quiz</h1>
        <p className="text-slate-600 leading-relaxed">
          Quick checks after each topic. Immediate feedback — no pressure.
        </p>
      </header>
      <QuizEngine />
    </main>
  )
}
