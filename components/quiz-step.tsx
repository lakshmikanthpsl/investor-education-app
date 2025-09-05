"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface QuizStepProps {
  quiz: {
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }
  onAnswer: (correct: boolean) => void
}

export function QuizStep({ quiz, onAnswer }: QuizStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
      const isCorrect = selectedAnswer === quiz.correctAnswer
      onAnswer(isCorrect)
    }
  }

  return (
    <Card className="bg-yellow-50 border-yellow-200">
      <CardContent className="p-6 space-y-4">
        <h3 className="font-semibold text-yellow-800 mb-4">{quiz.question}</h3>

        <div className="space-y-3">
          {quiz.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && setSelectedAnswer(index)}
              disabled={showResult}
              className={`w-full p-3 text-left rounded-lg border transition-colors ${
                showResult
                  ? index === quiz.correctAnswer
                    ? "bg-green-100 border-green-300 text-green-800"
                    : index === selectedAnswer && index !== quiz.correctAnswer
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-white border-gray-200"
                  : selectedAnswer === index
                    ? "bg-yellow-100 border-yellow-300"
                    : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                {showResult && index === quiz.correctAnswer && <CheckCircle className="h-5 w-5 text-green-600" />}
                {showResult && index === selectedAnswer && index !== quiz.correctAnswer && (
                  <XCircle className="h-5 w-5 text-red-600" />
                )}
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {!showResult && (
          <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="w-full">
            Submit Answer
          </Button>
        )}

        {showResult && (
          <div className="mt-4 p-4 bg-white rounded-lg border">
            <p className="font-medium mb-2">{selectedAnswer === quiz.correctAnswer ? "✅ Correct!" : "❌ Incorrect"}</p>
            <p className="text-sm text-slate-600">{quiz.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
