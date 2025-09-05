"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Star, Flame, Target, TrendingUp, Award, Calendar, BookOpen, DollarSign, Globe } from "lucide-react"
import { useGamification } from "@/hooks/use-gamification"
import { achievements, GamificationEngine, type Achievement } from "@/lib/gamification"
import { useLanguage } from "@/contexts/language-context"

export function GamificationDashboard() {
  const gamification = useGamification()
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([])
  const [showAchievementModal, setShowAchievementModal] = useState(false)
  const { t } = useLanguage()

  // Check for new achievements on component mount and stats changes
  useEffect(() => {
    const checkAchievements = () => {
      const newAchs = gamification.getNewAchievements()
      if (newAchs.length > 0) {
        setNewAchievements(newAchs)
        setShowAchievementModal(true)
      }
    }

    checkAchievements()
  }, [gamification.totalPoints, gamification.lessonsCompleted, gamification.quizzesCompleted])

  const levelProgress =
    ((gamification.experiencePoints - (gamification.experiencePoints - gamification.experienceToNextLevel)) /
      (gamification.experiencePoints - gamification.experienceToNextLevel + gamification.experienceToNextLevel)) *
    100

  const unlockedAchievements = achievements.filter((a) => gamification.achievements.includes(a.id))
  const lockedAchievements = achievements.filter((a) => !gamification.achievements.includes(a.id))

  return (
    <div className="space-y-6">
      {/* Achievement Notification Modal */}
      {showAchievementModal && newAchievements.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Trophy className="h-5 w-5" />
              New Achievement{newAchievements.length > 1 ? "s" : ""} Unlocked!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {newAchievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border">
                  <span className="text-2xl">{achievement.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-slate-600">{achievement.description}</p>
                  </div>
                  <Badge className={GamificationEngine.getRarityColor(achievement.rarity)}>
                    +{achievement.points} XP
                  </Badge>
                </div>
              ))}
              <Button
                onClick={() => setShowAchievementModal(false)}
                className="w-full bg-yellow-600 hover:bg-yellow-700"
              >
                Awesome!
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-slate-600">Level</span>
            </div>
            <div className="text-2xl font-bold">{gamification.level}</div>
            <div className="text-xs text-slate-500">{gamification.experienceToNextLevel} XP to next level</div>
            <Progress value={levelProgress} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-slate-600">Total Points</span>
            </div>
            <div className="text-2xl font-bold">{gamification.totalPoints.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-4 w-4 text-orange-600" />
              <span className="text-sm text-slate-600">Current Streak</span>
            </div>
            <div className="text-2xl font-bold">{gamification.loginStreak}</div>
            <div className="text-xs text-slate-500">Best: {gamification.longestStreak} days</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Award className="h-4 w-4 text-purple-600" />
              <span className="text-sm text-slate-600">Achievements</span>
            </div>
            <div className="text-2xl font-bold">{gamification.achievements.length}</div>
            <div className="text-xs text-slate-500">of {achievements.length} total</div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Tabs defaultValue="progress" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Lessons Completed</span>
                  <span className="font-semibold">{gamification.lessonsCompleted}/4</span>
                </div>
                <Progress value={(gamification.lessonsCompleted / 4) * 100} />

                <div className="flex justify-between items-center">
                  <span className="text-sm">Quizzes Completed</span>
                  <span className="font-semibold">{gamification.quizzesCompleted}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Quiz Score</span>
                  <span className="font-semibold">{gamification.averageQuizScore}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Activity Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    Trading P&L
                  </span>
                  <span
                    className={`font-semibold ${gamification.tradingProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                  >
                    ₹{gamification.tradingProfit.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <Globe className="h-3 w-3" />
                    Documents Translated
                  </span>
                  <span className="font-semibold">{gamification.documentsTranslated}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Member Since
                  </span>
                  <span className="font-semibold">{new Date(gamification.joinDate).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <div className="space-y-6">
            {/* Unlocked Achievements */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-yellow-600" />
                Unlocked ({unlockedAchievements.length})
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {unlockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="border-emerald-200 bg-emerald-50">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-emerald-800">{achievement.title}</h4>
                          <p className="text-sm text-emerald-700">{achievement.description}</p>
                        </div>
                        <Badge className={GamificationEngine.getRarityColor(achievement.rarity)}>
                          {achievement.points} XP
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Locked Achievements */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-600" />
                Locked ({lockedAchievements.length})
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {lockedAchievements.map((achievement) => (
                  <Card key={achievement.id} className="opacity-60">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl grayscale">{achievement.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold">{achievement.title}</h4>
                          <p className="text-sm text-slate-600">{achievement.description}</p>
                        </div>
                        <Badge variant="outline">{achievement.points} XP</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Detailed Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-3">
                  <h4 className="font-medium">Learning Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Experience Points:</span>
                      <span className="font-medium">{gamification.experiencePoints}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lessons Completed:</span>
                      <span className="font-medium">{gamification.lessonsCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Quizzes Taken:</span>
                      <span className="font-medium">{gamification.quizzesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Score:</span>
                      <span className="font-medium">{gamification.averageQuizScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Activity Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Current Streak:</span>
                      <span className="font-medium">{gamification.loginStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Longest Streak:</span>
                      <span className="font-medium">{gamification.longestStreak} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Documents Translated:</span>
                      <span className="font-medium">{gamification.documentsTranslated}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Trading Profit:</span>
                      <span
                        className={`font-medium ${gamification.tradingProfit >= 0 ? "text-emerald-600" : "text-red-600"}`}
                      >
                        ₹{gamification.tradingProfit.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
