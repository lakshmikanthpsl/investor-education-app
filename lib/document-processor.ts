export interface DocumentSummary {
  originalText: string
  summary: string
  translatedSummary: string
  keyPoints: string[]
  sourceType: "sebi" | "nism" | "nse" | "bse" | "rbi" | "other"
  confidence: number
  language: string
}

export interface ProcessingOptions {
  targetLanguage: string
  summaryLength: "short" | "medium" | "detailed"
  includeKeyPoints: boolean
  preserveNumbers: boolean
}

export class DocumentProcessor {
  private static readonly SEBI_DOMAINS = ["sebi.gov.in", "sebionline.com"]
  private static readonly NISM_DOMAINS = ["nism.ac.in"]
  private static readonly EXCHANGE_DOMAINS = ["nseindia.com", "bseindia.com"]
  private static readonly RBI_DOMAINS = ["rbi.org.in"]

  static detectSourceType(url: string): DocumentSummary["sourceType"] {
    const domain = new URL(url).hostname.toLowerCase()

    if (this.SEBI_DOMAINS.some((d) => domain.includes(d))) return "sebi"
    if (this.NISM_DOMAINS.some((d) => domain.includes(d))) return "nism"
    if (this.EXCHANGE_DOMAINS.some((d) => domain.includes(d))) {
      return domain.includes("nse") ? "nse" : "bse"
    }
    if (this.RBI_DOMAINS.some((d) => domain.includes(d))) return "rbi"
    return "other"
  }

  static extractKeyFinancialTerms(text: string): string[] {
    const financialTerms = [
      "IPO",
      "mutual fund",
      "SIP",
      "NAV",
      "expense ratio",
      "portfolio",
      "diversification",
      "risk assessment",
      "market capitalization",
      "P/E ratio",
      "dividend yield",
      "systematic risk",
      "unsystematic risk",
      "asset allocation",
      "rebalancing",
      "volatility",
      "beta",
      "alpha",
      "sharpe ratio",
      "drawdown",
      "liquidity",
      "derivatives",
      "futures",
      "options",
      "commodity",
      "equity",
      "debt",
      "credit rating",
      "yield",
      "maturity",
      "duration",
      "inflation",
      "regulatory compliance",
      "KYC",
      "AML",
      "insider trading",
      "market manipulation",
    ]

    const foundTerms = financialTerms.filter((term) => text.toLowerCase().includes(term.toLowerCase()))

    return [...new Set(foundTerms)].slice(0, 10) // Return unique terms, max 10
  }

  static generateOfflineSummary(text: string, options: ProcessingOptions): string {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 20)

    // Score sentences based on financial keywords and position
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0

      // Position scoring (first and last sentences get higher scores)
      if (index < 3) score += 2
      if (index >= sentences.length - 3) score += 1

      // Financial terms scoring
      const financialKeywords = [
        "investment",
        "risk",
        "return",
        "portfolio",
        "market",
        "fund",
        "equity",
        "debt",
        "dividend",
        "interest",
        "inflation",
        "regulation",
        "compliance",
        "sebi",
        "nism",
        "investor",
        "trading",
        "securities",
        "mutual fund",
      ]

      financialKeywords.forEach((keyword) => {
        if (sentence.toLowerCase().includes(keyword)) score += 1
      })

      // Length scoring (prefer medium-length sentences)
      const words = sentence.trim().split(/\s+/).length
      if (words >= 10 && words <= 25) score += 1

      return { sentence: sentence.trim(), score, index }
    })

    // Sort by score and select top sentences
    const summaryLength = options.summaryLength === "short" ? 3 : options.summaryLength === "medium" ? 5 : 8

    const selectedSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, summaryLength)
      .sort((a, b) => a.index - b.index) // Restore original order
      .map((item) => item.sentence)

    return selectedSentences.join(". ") + "."
  }

  static translateToHindi(text: string): string {
    // Basic financial term translations for offline mode
    const translations: Record<string, string> = {
      investment: "निवेश",
      investor: "निवेशक",
      market: "बाजार",
      stock: "स्टॉक",
      share: "शेयर",
      portfolio: "पोर्टफोलियो",
      risk: "जोखिम",
      return: "रिटर्न",
      profit: "लाभ",
      loss: "हानि",
      fund: "फंड",
      "mutual fund": "म्यूचुअल फंड",
      equity: "इक्विटी",
      debt: "डेट",
      bond: "बॉन्ड",
      dividend: "लाभांश",
      interest: "ब्याज",
      inflation: "महंगाई",
      regulation: "नियमन",
      compliance: "अनुपालन",
      trading: "ट्रेडिंग",
      securities: "प्रतिभूतियां",
      diversification: "विविधीकरण",
    }

    let translatedText = text
    Object.entries(translations).forEach(([english, hindi]) => {
      const regex = new RegExp(`\\b${english}\\b`, "gi")
      translatedText = translatedText.replace(regex, hindi)
    })

    return `[हिंदी अनुवाद] ${translatedText}`
  }

  static async processDocument(
    content: string,
    url?: string,
    options: ProcessingOptions = {
      targetLanguage: "Hindi",
      summaryLength: "medium",
      includeKeyPoints: true,
      preserveNumbers: true,
    },
  ): Promise<DocumentSummary> {
    const sourceType = url ? this.detectSourceType(url) : "other"
    const keyPoints = options.includeKeyPoints ? this.extractKeyFinancialTerms(content) : []

    // Generate summary
    const summary = this.generateOfflineSummary(content, options)

    // Basic translation (in real implementation, this would use AI)
    let translatedSummary = summary
    if (options.targetLanguage.toLowerCase() === "hindi") {
      translatedSummary = this.translateToHindi(summary)
    } else {
      translatedSummary = `[${options.targetLanguage} Translation] ${summary}`
    }

    return {
      originalText: content,
      summary,
      translatedSummary,
      keyPoints,
      sourceType,
      confidence: 0.7, // Offline processing has lower confidence
      language: options.targetLanguage,
    }
  }
}
