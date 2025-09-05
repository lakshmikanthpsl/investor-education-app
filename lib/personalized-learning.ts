import { type QuestionCategory, questionCategories, questions } from "./questions"
import { lessons } from "./lessons"

export type TopicProficiency = {
  category: QuestionCategory
  totalQuestions: number
  correctAnswers: number
  proficiencyScore: number // 0-100
  lastUpdated: Date
}

export type LearningRecommendation = {
  id: string
  type: "lesson" | "quiz-retry" | "practice"
  title: string
  category: QuestionCategory
  estimatedTime: number // minutes
  priority: "high" | "medium" | "low"
  reason: string
  completed: boolean
  dismissed: boolean
}

export type PersonalizedLearningData = {
  topicProficiencies: Record<QuestionCategory, TopicProficiency>
  recommendations: LearningRecommendation[]
  learningStreak: number
  lastActivityDate: string | null
}

export class PersonalizedLearningEngine {
  static calculateTopicProficiency(
    category: QuestionCategory,
    quizResults: Array<{ questionIndex: number; correct: boolean }>,
  ): TopicProficiency {
    const categoryQuestions = questions
      .map((q, index) => ({ question: q, index }))
      .filter(({ question }) => question.category === category)

    const totalQuestions = categoryQuestions.length
    const correctAnswers = quizResults.filter((result) => {
      const question = categoryQuestions.find((cq) => cq.index === result.questionIndex)
      return question && result.correct
    }).length

    const proficiencyScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0

    return {
      category,
      totalQuestions,
      correctAnswers,
      proficiencyScore,
      lastUpdated: new Date(),
    }
  }

  static generateRecommendations(
    proficiencies: Record<QuestionCategory, TopicProficiency>,
    completedLessons: string[],
    dismissedRecommendations: string[] = [],
  ): LearningRecommendation[] {
    const recommendations: LearningRecommendation[] = []

    // Find weak areas (< 60% proficiency)
    Object.values(proficiencies).forEach((proficiency) => {
      if (proficiency.proficiencyScore < 60 && proficiency.totalQuestions > 0) {
        // Recommend relevant lessons
        const relevantLessons = lessons.filter(
          (lesson) => lesson.category === proficiency.category && !completedLessons.includes(lesson.id),
        )

        relevantLessons.forEach((lesson) => {
          const recId = `lesson-${lesson.id}`
          if (!dismissedRecommendations.includes(recId)) {
            recommendations.push({
              id: recId,
              type: "lesson",
              title: lesson.title,
              category: proficiency.category,
              estimatedTime: lesson.estimatedTime,
              priority: proficiency.proficiencyScore < 40 ? "high" : "medium",
              reason: `Improve your ${questionCategories[proficiency.category].name} knowledge (${proficiency.proficiencyScore}% proficiency)`,
              completed: false,
              dismissed: false,
            })
          }
        })

        // Recommend quiz retry
        const retryId = `quiz-retry-${proficiency.category}`
        if (!dismissedRecommendations.includes(retryId)) {
          recommendations.push({
            id: retryId,
            type: "quiz-retry",
            title: `Retake ${questionCategories[proficiency.category].name} Quiz`,
            category: proficiency.category,
            estimatedTime: 10,
            priority: "medium",
            reason: `Practice more questions to improve from ${proficiency.proficiencyScore}%`,
            completed: false,
            dismissed: false,
          })
        }
      }
    })

    // Sort by priority and proficiency score (lowest first)
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const aProficiency = proficiencies[a.category]?.proficiencyScore || 100
      const bProficiency = proficiencies[b.category]?.proficiencyScore || 100

      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority]
      }
      return aProficiency - bProficiency
    })
  }

  static calculateLearningStreak(lastActivityDate: string | null): number {
    if (!lastActivityDate) return 0

    const lastActivity = new Date(lastActivityDate)
    const today = new Date()
    const diffTime = today.getTime() - lastActivity.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    // If last activity was today or yesterday, maintain streak
    if (diffDays <= 1) {
      // This is a simplified calculation - in a real app, you'd track daily activities
      return 1
    }

    return 0
  }
}
