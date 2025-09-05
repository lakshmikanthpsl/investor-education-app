"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { questions } from "@/lib/questions"
import { useProgress } from "@/hooks/use-progress"
import { usePersonalizedLearning } from "@/hooks/use-personalized-learning"

type State = {
  idx: number
  selected: number | null
  score: number
  done: boolean
  quizResults: Array<{ questionIndex: number; correct: boolean; category: string }>
}

export function QuizEngine() {
  const [state, setState] = useState<State>({
    idx: 0,
    selected: null,
    score: 0,
    done: false,
    quizResults: [],
  })
  const { setQuizScore } = useProgress()
  const { updateTopicProficiency } = usePersonalizedLearning()

  const q = questions[state.idx]
  const total = questions.length

  const onSelect = (i: number) => setState((s) => ({ ...s, selected: i }))

  const onNext = () => {
    const correct = state.selected === q.answer
    const nextScore = state.score + (correct ? 1 : 0)
    const nextIdx = state.idx + 1

    const newQuizResult = {
      questionIndex: state.idx,
      correct,
      category: q.category,
    }
    const updatedResults = [...state.quizResults, newQuizResult]

    if (nextIdx >= total) {
      setState((s) => ({ ...s, score: nextScore, done: true, quizResults: updatedResults }))
      const pct = Math.round((nextScore / total) * 100)
      setQuizScore("core", pct)

      const categoriesInQuiz = [...new Set(questions.map((q) => q.category))]
      categoriesInQuiz.forEach((category) => {
        const categoryResults = updatedResults.filter((result) => {
          const question = questions[result.questionIndex]
          return question.category === category
        })
        updateTopicProficiency(category, categoryResults)
      })

      return
    }
    setState({
      idx: nextIdx,
      selected: null,
      score: nextScore,
      done: false,
      quizResults: updatedResults,
    })
  }

  const feedback = useMemo(() => {
    if (state.selected === null) return null
    const correct = state.selected === q.answer
    return correct ? { text: "Correct!", color: "text-emerald-600" } : { text: "Not quite.", color: "text-red-600" }
  }, [state.selected, q])

  if (!q) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>
            Question {state.idx + 1} / {total}
          </span>
          {state.done && (
            <span className="text-slate-600 text-sm">Score: {Math.round((state.score / total) * 100)}%</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="text-slate-800 font-medium">{q.text}</div>
        <div className="grid gap-2">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => onSelect(i)}
              className={`text-left rounded border p-3 leading-relaxed ${state.selected === i ? "border-sky-600 bg-sky-50" : "border-slate-200 hover:bg-slate-50"}`}
              aria-pressed={state.selected === i}
            >
              {opt}
            </button>
          ))}
        </div>
        {feedback && <div className={`text-sm ${feedback.color}`}>{feedback.text}</div>}
        {!state.done && (
          <div className="pt-2">
            <Button className="bg-sky-600 hover:bg-sky-700" onClick={onNext} disabled={state.selected === null}>
              {state.idx === total - 1 ? "Finish" : "Next"}
            </Button>
          </div>
        )}
        {state.done && (
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={() =>
                setState({
                  idx: 0,
                  selected: null,
                  score: 0,
                  done: false,
                  quizResults: [],
                })
              }
            >
              Retry
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
