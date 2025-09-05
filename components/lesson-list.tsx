"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, CheckCircle } from "lucide-react"
import { lessons, type Lesson } from "@/lib/lessons"
import { useProgress } from "@/hooks/use-progress"

interface LessonListProps {
  onSelectLesson: (lesson: Lesson) => void
}

export function LessonList({ onSelectLesson }: LessonListProps) {
  const { completedLessons } = useProgress()

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "basics":
        return "bg-blue-100 text-blue-800"
      case "risk":
        return "bg-orange-100 text-orange-800"
      case "algo":
        return "bg-purple-100 text-purple-800"
      case "diversification":
        return "bg-emerald-100 text-emerald-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid gap-4">
      {lessons.map((lesson) => {
        const isCompleted = completedLessons.includes(lesson.id)
        const canStart =
          !lesson.prerequisites || lesson.prerequisites.every((prereq) => completedLessons.includes(prereq))

        return (
          <Card key={lesson.id} className={`border-slate-200 ${!canStart ? "opacity-60" : ""}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-lg">{lesson.title}</CardTitle>
                    {isCompleted && <CheckCircle className="h-5 w-5 text-emerald-600" />}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
                    <Badge className={getCategoryColor(lesson.category)}>{lesson.category}</Badge>
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      {lesson.estimatedTime} min
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-700 leading-relaxed">{lesson.summary}</p>

              {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                <div className="text-sm text-slate-600">
                  <span className="font-medium">Prerequisites:</span>{" "}
                  {lesson.prerequisites
                    .map((prereq) => {
                      const prereqLesson = lessons.find((l) => l.id === prereq)
                      return prereqLesson?.title || prereq
                    })
                    .join(", ")}
                </div>
              )}

              <div className="flex items-center gap-3">
                <Button
                  onClick={() => onSelectLesson(lesson)}
                  disabled={!canStart}
                  className={isCompleted ? "bg-emerald-500 hover:bg-emerald-600" : "bg-sky-600 hover:bg-sky-700"}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {isCompleted ? "Review Lesson" : canStart ? "Start Lesson" : "Locked"}
                </Button>
                {isCompleted && (
                  <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    Completed
                  </span>
                )}
                {!canStart && !isCompleted && (
                  <span className="text-slate-500 text-sm">Complete prerequisites first</span>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
