"use client"

import { useMemo, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

type Lang = "hi" | "mr"

const GLOSSARY: Record<Lang, Record<string, string>> = {
  hi: {
    stock: "शेयर",
    stocks: "शेयर",
    market: "बाज़ार",
    risk: "जोखिम",
    diversification: "विविधीकरण",
    investor: "निवेशक",
    investors: "निवेशक",
    order: "ऑर्डर",
    orders: "ऑर्डर",
    settlement: "निपटान",
    regulator: "नियामक",
    exchange: "एक्सचेंज",
    portfolio: "पोर्टफोलियो",
    volatility: "अस्थिरता",
    algorithmic: "एल्गोरिदमिक",
    "high-frequency": "हाई-फ़्रीक्वेंसी",
  },
  mr: {
    stock: "शेअर",
    stocks: "शेअर्स",
    market: "बाजार",
    risk: "जोखीम",
    diversification: "विविधीकरण",
    investor: "गुंतवणूकदार",
    investors: "गुंतवणूकदार",
    order: "ऑर्डर",
    orders: "ऑर्डर्स",
    settlement: "सेटलमेंट",
    regulator: "नियामक",
    exchange: "एक्स्चेंज",
    portfolio: "पोर्टफोलिओ",
    volatility: "चलनवलन",
    algorithmic: "अल्गोरिद्मिक",
    "high-frequency": "हाय-फ्रीक्वेन्सी",
  },
}

function summarizeExtractive(text: string, maxSentences = 5): string {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.?!])\s+/)
    .filter((s) => s.trim().length > 0)

  if (sentences.length <= maxSentences) return text.trim()

  // naive scoring: sentence length + keyword hits
  const keywords = ["risk", "investor", "market", "diversification", "regulator", "order", "settlement"]
  const scored = sentences.map((s) => {
    const base = Math.min(200, s.length)
    const extra = keywords.reduce((acc, k) => acc + (s.toLowerCase().includes(k) ? 20 : 0), 0)
    return { s, score: base + extra }
  })
  scored.sort((a, b) => b.score - a.score)
  const top = scored.slice(0, maxSentences).map((x) => x.s)
  return top.join(" ")
}

function applyGlossary(text: string, lang: Lang): string {
  const dict = GLOSSARY[lang]
  const re = new RegExp(`\\b(${Object.keys(dict).join("|")})\\b`, "gi")
  return text.replace(re, (match) => {
    const lower = match.toLowerCase()
    const replacement = dict[lower]
    // preserve capitalization if first letter capitalized
    if (!replacement) return match
    if (match[0] === match[0].toUpperCase()) {
      return replacement // vernacular usually doesn’t capitalize similarly
    }
    return replacement
  })
}

export function Translator() {
  const [input, setInput] = useState("")
  const [lang, setLang] = useState<Lang>("hi")
  const [summary, setSummary] = useState("")
  const [translated, setTranslated] = useState("")

  const canRun = useMemo(() => input.trim().length > 0, [input])

  const run = () => {
    const sum = summarizeExtractive(input)
    const trans = applyGlossary(sum, lang)
    setSummary(sum)
    setTranslated(trans)
  }

  const clear = () => {
    setInput("")
    setSummary("")
    setTranslated("")
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="lang">Language</Label>
        <select
          id="lang"
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2"
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
        >
          <option value="hi">Hindi (hi)</option>
          <option value="mr">Marathi (mr)</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="src">Paste content</Label>
        <Textarea
          id="src"
          placeholder="Paste SEBI/NISM paragraph(s) here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-40"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button className="bg-sky-600 hover:bg-sky-600" onClick={run} disabled={!canRun}>
          Summarize & Translate
        </Button>
        <Button variant="outline" onClick={clear}>
          Clear
        </Button>
      </div>

      {(summary || translated) && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">Summary (EN)</div>
              <div className="leading-relaxed">{summary}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-sm text-slate-600 mb-1">Vernacular Draft</div>
              <div className="leading-relaxed">{translated}</div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="text-xs text-slate-600">
        Prototype: glossary-based translation is approximate and may not capture nuance. Verify with authoritative
        sources.
      </div>
    </div>
  )
}
