"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, BookOpen } from "lucide-react"
import type { Lesson } from "@/lib/lessons"
import { InteractiveElement } from "./interactive-element"
import { QuizStep } from "./quiz-step"
import { useLanguage } from "@/contexts/language-context"

interface InteractiveLessonProps {
  lesson: Lesson
  onComplete: () => void
  onBack: () => void
}

export function InteractiveLesson({ lesson, onComplete, onBack }: InteractiveLessonProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const { t } = useLanguage()

  const progress = ((currentStep + 1) / lesson.steps.length) * 100
  const step = lesson.steps[currentStep]

  const handleNext = () => {
    setCompletedSteps((prev) => new Set([...prev, currentStep]))

    if (currentStep < lesson.steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

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

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Lesson Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t.common.back}
          </Button>
          <Badge className={getDifficultyColor(lesson.difficulty)}>{lesson.difficulty}</Badge>
          <div className="flex items-center gap-1 text-sm text-slate-600">
            <Clock className="h-4 w-4" />
            {lesson.estimatedTime} min
          </div>
        </div>

        <h1 className="text-2xl font-semibold mb-2 text-balance">{lesson.title}</h1>
        <p className="text-slate-600 leading-relaxed mb-4">{lesson.summary}</p>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Step {currentStep + 1} of {lesson.steps.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Lesson Content */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            {step.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="prose prose-slate max-w-none">
            <p className="leading-relaxed">{step.content}</p>
          </div>

          {/* Interactive Elements */}
          {step.type === "interactive" && step.interactiveElement && (
            <InteractiveElement element={step.interactiveElement} />
          )}

          {/* Quiz Elements */}
          {step.type === "quiz" && step.quiz && (
            <QuizStep
              quiz={step.quiz}
              onAnswer={(correct) => {
                if (correct) {
                  setTimeout(handleNext, 1500)
                }
              }}
            />
          )}

          {/* Example Highlight */}
          {step.type === "example" && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full" />
                <span className="font-medium text-blue-800">Example</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <div className="flex gap-2">
          {lesson.steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-8 rounded-full ${index <= currentStep ? "bg-sky-600" : "bg-slate-200"}`}
            />
          ))}
        </div>

        {step.type !== "quiz" && (
          <Button onClick={handleNext}>
            {currentStep === lesson.steps.length - 1 ? "Complete" : "Next"}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        )}
      </div>

      {/* Key Takeaways (shown on last step) */}
      {currentStep === lesson.steps.length - 1 && (
        <Card className="mt-6 bg-emerald-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="text-emerald-800">Key Takeaways</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {lesson.keyTakeaways.map((takeaway, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="h-1.5 w-1.5 bg-emerald-600 rounded-full mt-2 flex-shrink-0" />
                  <span className="text-emerald-800">{takeaway}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
