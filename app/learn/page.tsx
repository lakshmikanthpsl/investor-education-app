"use client"

import { useState } from "react"
import { LessonList } from "@/components/lesson-list"
import { ProgressSummary } from "@/components/progress-summary"
import { InteractiveLesson } from "@/components/interactive-lesson"
import type { Lesson } from "@/lib/lessons"
import { useLanguage } from "@/contexts/language-context"

export default function LearnPage() {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const { t } = useLanguage()

  if (selectedLesson) {
    return (
      <InteractiveLesson
        lesson={selectedLesson}
        onComplete={() => {
          // Mark lesson as completed and return to list
          setSelectedLesson(null)
        }}
        onBack={() => setSelectedLesson(null)}
      />
    )
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-balance">{t.learn.title}</h1>
        <p className="text-slate-600 leading-relaxed">{t.learn.description}</p>
      </header>
      <ProgressSummary />
      <LessonList onSelectLesson={setSelectedLesson} />
    </main>
  )
}
