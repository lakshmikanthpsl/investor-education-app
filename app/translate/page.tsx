"use client"

import { EnhancedTranslator } from "@/components/enhanced-translator"
import { useLanguage } from "@/contexts/language-context"

export default function TranslatePage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto max-w-4xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-balance">{t.translation.title}</h1>
        <p className="text-slate-600 leading-relaxed">{t.translation.description}</p>
      </header>
      <EnhancedTranslator />
    </main>
  )
}
