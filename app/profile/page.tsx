"use client"

import { GamificationDashboard } from "@/components/gamification-dashboard"
import { PersonalizedRecommendations } from "@/components/personalized-recommendations"
import { useLanguage } from "@/contexts/language-context"

export default function ProfilePage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-balance">Your Progress</h1>
        <p className="text-slate-600 leading-relaxed">Track your learning journey, achievements, and statistics.</p>
      </header>

      <div className="space-y-8">
        <PersonalizedRecommendations />

        <GamificationDashboard />
      </div>
    </main>
  )
}
