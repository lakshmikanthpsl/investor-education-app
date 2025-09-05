import MarketAnalysis from "@/components/market-analysis"

export default function AnalyzePage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6">
      <header className="mb-6">
        <h1 className="text-balance text-2xl font-semibold text-slate-900 md:text-3xl">
          Live Market Analysis (prototype)
        </h1>
        <p className="mt-2 max-w-prose text-sm text-slate-600">
          Explore price trends, common indicators, and risk metrics using delayed/simulated data. Enable a data provider
          later to switch to real delayed quotes.
        </p>
      </header>
      <MarketAnalysis />
    </main>
  )
}
