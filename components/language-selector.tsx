"use client"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"
import { type Language, languageNames } from "@/lib/i18n"
import { Globe, Check } from "lucide-react"

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-white/60 backdrop-blur-sm border-slate-200 hover:bg-white/80 min-w-[100px] h-9 px-3"
        >
          <Globe className="h-4 w-4 text-blue-600" />
          <span className="hidden sm:inline">{languageNames[language]}</span>
          <span className="sm:hidden text-xs font-medium">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-slate-200 shadow-lg">
        {Object.entries(languageNames).map(([code, name]) => (
          <DropdownMenuItem
            key={code}
            onClick={() => setLanguage(code as Language)}
            className={`flex items-center justify-between py-3 px-4 cursor-pointer transition-colors ${
              language === code
                ? "bg-gradient-to-r from-blue-50 to-orange-50 text-blue-700 font-medium"
                : "hover:bg-slate-50"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-lg">
                {code === "en" && "🇬🇧"}
                {code === "hi" && "🇮🇳"}
                {code === "ta" && "🇮🇳"}
                {code === "bn" && "🇮🇳"}
              </span>
              {name}
            </span>
            {language === code && <Check className="h-4 w-4 text-blue-600" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
