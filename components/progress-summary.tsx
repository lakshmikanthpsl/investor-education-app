"use client"

import { useMemo } from "react"
import { useProgress } from "@/hooks/use-progress"
import { lessons } from "@/lib/lessons"
import { Card, CardContent } from "@/components/ui/card"

export function ProgressSummary() {
  const { completedLessons, quizScores } = useProgress()
  const total = lessons.length
  const pct = Math.round((completedLessons.length / total) * 100)

  const avgScore = useMemo(() => {
    const values = Object.values(quizScores)
    if (values.length === 0) return 0
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length)
  }, [quizScores])

  return (
    <Card className="mb-6">
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm text-slate-700">
            <span>Lesson completion</span>
            <span>{pct}%</span>
          </div>
          <div className="h-2 w-full rounded bg-slate-200 overflow-hidden">
            <div className="h-2 bg-sky-600" style={{ width: `${pct}%` }} aria-label="Lesson completion" />
          </div>
          <div className="text-sm text-slate-700">
            Avg quiz score: <span className="font-medium">{avgScore}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
