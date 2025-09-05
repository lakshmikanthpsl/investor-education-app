"use client"

import { usePersonalizedLearning } from "@/hooks/use-personalized-learning"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, X, CheckCircle, TrendingUp, Target } from "lucide-react"
import { questionCategories } from "@/lib/questions"

export function PersonalizedRecommendations() {
  const { t } = useLanguage()
  const { recommendations, topicProficiencies, learningStreak, dismissRecommendation, completeRecommendation } =
    usePersonalizedLearning()

  const activeRecommendations = recommendations.filter((rec) => !rec.dismissed && !rec.completed)
  const weakAreas = Object.values(topicProficiencies).filter((prof) => prof.proficiencyScore < 60)

  if (activeRecommendations.length === 0 && weakAreas.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-green-600" />
            {t.personalized.recommendedForYou}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-slate-600">{t.personalized.allCaughtUp}</p>
            <p className="text-sm text-slate-500 mt-1">{t.personalized.keepLearningMessage}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Learning Streak */}
      {learningStreak > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">
                  {t.personalized.learningStreak.replace("{days}", learningStreak.toString())}
                </p>
                <p className="text-sm text-orange-600">{t.personalized.keepStreakGoing}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {t.personalized.recommendedForYou}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium">{recommendation.title}</h4>
                    <Badge
                      variant={recommendation.priority === "high" ? "destructive" : "secondary"}
                      className="text-xs"
                    >
                      {recommendation.priority === "high" ? t.personalized.highPriority : t.personalized.recommended}
                    </Badge>
                  </div>

                  <p className="text-sm text-slate-600 mb-2">{recommendation.reason}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {recommendation.estimatedTime} {t.personalized.minutes}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {questionCategories[recommendation.category].name}
                    </Badge>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dismissRecommendation(recommendation.id)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => completeRecommendation(recommendation.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {recommendation.type === "lesson" ? t.personalized.startLesson : t.personalized.retakeQuiz}
                </Button>
                <Button variant="outline" size="sm" onClick={() => dismissRecommendation(recommendation.id)}>
                  {t.personalized.notInterested}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Topic Proficiencies */}
      {weakAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.personalized.areasToImprove}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {weakAreas.map((proficiency) => (
                <div key={proficiency.category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{questionCategories[proficiency.category].name}</p>
                    <p className="text-sm text-slate-600">{questionCategories[proficiency.category].description}</p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${proficiency.proficiencyScore < 40 ? "text-red-600" : "text-orange-600"}`}
                    >
                      {proficiency.proficiencyScore}%
                    </div>
                    <div className="text-xs text-slate-500">
                      {proficiency.correctAnswers}/{proficiency.totalQuestions} {t.personalized.correct}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
