import { type NextRequest, NextResponse } from "next/server"
import { stripHtml } from "./utils" // Assuming stripHtml is moved to a utils file

const GLOSSARY_HI: Record<string, string> = {
  stock: "शेयर",
  stocks: "शेयर",
  market: "बाज़ार",
  risk: "जोखिम",
  diversification: "विविधीकरण",
  investor: "निवेशक",
  investors: "निवेशक",
  order: "ऑर्डर",
  orders: "ऑर्डर्स",
  settlement: "निपटान",
  regulator: "नियामक",
  exchange: "एक्सचेंज",
  portfolio: "पोर्टफोलियो",
  volatility: "अस्थिरता",
  algorithmic: "एल्गोरिदमिक",
  "high-frequency": "हाई-फ़्रीक्वेंसी",
}

const GLOSSARY_MR: Record<string, string> = {
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
}

function applyGlossary(text: string, lang: string): string {
  const dict = lang === "Hindi" ? GLOSSARY_HI : lang === "Marathi" ? GLOSSARY_MR : null
  if (!dict) return text
  const re = new RegExp(`\\b(${Object.keys(dict).join("|")})\\b`, "gi")
  return text.replace(re, (m) => dict[m.toLowerCase()] ?? m)
}

function summarizeExtractive(input: string, maxSentences = 6): string {
  const text = input.replace(/\s+/g, " ").trim()
  const sentences = text.split(/(?<=[.?!])\s+/).filter((s) => s.length > 0)
  if (sentences.length <= maxSentences) return text.slice(0, 2400)

  const keywords = [
    "risk",
    "investor",
    "market",
    "diversification",
    "regulator",
    "order",
    "settlement",
    "disclosure",
    "volatility",
    "drawdown",
  ]
  const scored = sentences.map((s) => {
    const base = Math.min(180, s.length)
    const extra = keywords.reduce((acc, k) => acc + (s.toLowerCase().includes(k) ? 18 : 0), 0)
    return { s, score: base + extra }
  })
  scored.sort((a, b) => b.score - a.score)
  return scored
    .slice(0, maxSentences)
    .map((x) => x.s)
    .join(" ")
}

export async function POST(req: NextRequest) {
  try {
    const { url, text, targetLang } = await req.json()

    let source = ""
    if (url) {
      try {
        const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } })
        const html = await r.text()
        source += stripHtml(html)
      } catch {
        // ignore fetch errors and rely on provided text
      }
    }
    if (text) source += "\n\n" + String(text)

    if (!source.trim()) {
      return NextResponse.json({ error: "Provide a valid URL or source text." }, { status: 400 })
    }

    if (process.env.GROQ_API_KEY) {
      const [{ generateText }, { groq }] = await Promise.all([import("ai"), import("@ai-sdk/groq")])
      const prompt = [
        `You are a financial literacy assistant focusing on investor education (SEBI/NISM aligned).`,
        `Summarize the following content accurately and neutrally in ${targetLang}.`,
        `Constraints:`,
        `- Educational purpose only; do not provide investment advice.`,
        `- Preserve key definitions, risks, and disclaimers.`,
        `- Use clear, simple language appropriate for first-time investors.`,
        `Content:\n${source}`,
      ].join("\n")

      const { text: aiSummary } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt,
        maxOutputTokens: 800,
        temperature: 0.3,
      })
      return NextResponse.json({ summary: aiSummary })
    }

    // Offline fallback: extractive English summary + optional Hindi/Marathi glossary substitution
    const engSummary = summarizeExtractive(source)
    const maybeTranslated =
      targetLang === "Hindi" || targetLang === "Marathi" ? applyGlossary(engSummary, targetLang) : engSummary

    const note =
      targetLang === "Hindi" || targetLang === "Marathi"
        ? " (glossary-based draft)"
        : " (English fallback; add an AI integration for full translations)"
    return NextResponse.json({
      summary: `[Offline${note}] ${maybeTranslated}`,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unexpected error" }, { status: 500 })
  }
}
