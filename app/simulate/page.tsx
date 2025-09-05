"use client"

import { AdvancedTradingSimulator } from "@/components/advanced-trading-simulator"
import { MarketSnapshot } from "@/components/market-snapshot"
import { useLanguage } from "@/contexts/language-context"

export default function SimulatePage() {
  const { t } = useLanguage()

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold mb-2 text-balance">{t.trading.title}</h1>
        <p className="text-slate-600 leading-relaxed">{t.trading.description}</p>
      </header>

      <div className="mb-6">
        <MarketSnapshot />
      </div>

      <AdvancedTradingSimulator />
    </main>
  )
}
