"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BookOpen, Brain, TrendingUp, Languages, User, Video } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

export function MobileNavigation() {
  const pathname = usePathname()
  const { t } = useLanguage()

  const navItems = [
    { href: "/", icon: Home, label: t.nav.home },
    { href: "/learn", icon: BookOpen, label: t.nav.learn },
    { href: "/quiz", icon: Brain, label: t.nav.quiz },
    { href: "/simulate", icon: TrendingUp, label: t.nav.simulate },
    { href: "/translate", icon: Languages, label: t.nav.translate },
    { href: "/videos", icon: Video, label: t.nav.videos },
    { href: "/profile", icon: User, label: "Profile" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-slate-200 sm:hidden">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-2 py-2 rounded-lg transition-colors min-w-0 flex-1",
                isActive ? "text-blue-600 bg-blue-50" : "text-slate-600 hover:text-slate-900 hover:bg-slate-50",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium truncate w-full text-center">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
