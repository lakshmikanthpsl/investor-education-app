"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"
import { LanguageSelector } from "@/components/language-selector"
import { useGamification } from "@/hooks/use-gamification"
import { MarketSnapshot } from "@/components/market-snapshot"
import { Trophy, Star, BookOpen, Brain, TrendingUp, Languages, Video } from "lucide-react"

// Color system (5 colors total):
// - Primary: blue-600 (Indian flag inspired)
// - Secondary: orange-500 (Indian flag inspired)
// - Neutrals: white, slate-900, slate-500
// - Success: emerald-500

export default function Home() {
  const { t } = useLanguage()
  const gamification = useGamification()

  return (
    <main className="min-h-dvh bg-gradient-to-br from-blue-50 to-orange-50 text-slate-900">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">₹</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-balance bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                  {t.home.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <LanguageSelector />
              <div className="flex items-center gap-2 px-2 sm:px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-xl border border-slate-200 shadow-sm">
                <Star className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-semibold">L{gamification.level}</span>
                <span className="hidden sm:inline text-xs text-slate-600">•</span>
                <span className="hidden sm:inline text-xs text-slate-600">{gamification.totalPoints} XP</span>
              </div>
              <Badge className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white border-0 shadow-sm">
                {t.home.prototype}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-12">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4 text-balance bg-gradient-to-r from-blue-600 via-slate-800 to-orange-500 bg-clip-text text-transparent leading-tight">
            {t.home.subtitle}
          </h2>
          <p className="text-slate-600 leading-relaxed text-base sm:text-lg max-w-3xl mx-auto px-2">
            {t.home.description}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className="px-3 py-1 bg-white/60 rounded-full">NSE • BSE</span>
            <span className="px-3 py-1 bg-white/60 rounded-full">SEBI Compliant</span>
            <span className="px-3 py-1 bg-white/60 rounded-full">₹ INR Focus</span>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/learn" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">{t.learn.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{t.learn.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t.learn.features.lessons}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {t.learn.features.progress}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/quiz" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-orange-100">
                    <Brain className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-lg">{t.quiz.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{t.quiz.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {t.quiz.features.feedback}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    {t.quiz.features.scores}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/simulate" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-emerald-100">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <CardTitle className="text-lg">{t.trading.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{t.trading.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t.trading.features.paperTrading}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    {t.trading.features.charts}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/translate" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-purple-100">
                    <Languages className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">{t.translation.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{t.translation.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t.translation.features.paste}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    {t.translation.features.summary}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/videos" className="group">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-slate-100">
                    <Video className="h-5 w-5 text-slate-600" />
                  </div>
                  <CardTitle className="text-lg">{t.videos.title}</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">{t.videos.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    {t.videos.features.aiGenerated}
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                    {t.videos.features.customTopics}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile" className="group sm:col-span-2 lg:col-span-1">
            <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-gradient-to-br from-yellow-50 to-orange-50 group-hover:scale-[1.02] group-active:scale-[0.98]">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-yellow-100">
                    <Trophy className="h-5 w-5 text-yellow-600" />
                  </div>
                  <CardTitle className="text-lg">Your Progress</CardTitle>
                </div>
                <CardDescription className="text-sm leading-relaxed">
                  Track achievements and learning statistics
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-yellow-600">{gamification.level}</div>
                    <div className="text-xs text-slate-600">Level</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-orange-600">{gamification.achievements.length}</div>
                    <div className="text-xs text-slate-600">Badges</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-emerald-600">{gamification.loginStreak}</div>
                    <div className="text-xs text-slate-600">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <div className="sm:col-span-2 lg:col-span-3">
            <MarketSnapshot />
          </div>
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-slate-600">Indian Markets • Educational Mode</span>
          </div>
        </div>
      </section>

      <footer className="border-t bg-white/60 backdrop-blur-sm mt-8 sm:mt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-8">
          <div className="text-center">
            <p className="text-sm text-slate-600 leading-relaxed">{t.home.footer}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-4 text-xs text-slate-500">
              <span>SEBI Guidelines Compliant</span>
              <span>•</span>
              <span>Educational Purpose Only</span>
              <span>•</span>
              <span>Made for India 🇮🇳</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
