"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FileText, Globe, Download, Copy, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { DocumentProcessor, type DocumentSummary, type ProcessingOptions } from "@/lib/document-processor"
import { useLanguage } from "@/contexts/language-context"

const supportedLanguages = [
  { code: "hi", name: "Hindi", native: "हिन्दी" },
  { code: "bn", name: "Bengali", native: "বাংলা" },
  { code: "ta", name: "Tamil", native: "தமிழ்" },
  { code: "te", name: "Telugu", native: "తెలుగు" },
  { code: "mr", name: "Marathi", native: "मराठी" },
  { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", native: "ଓଡ଼ିଆ" },
]

const summaryLengths = [
  { value: "short", label: "Short (3-4 sentences)", description: "Quick overview" },
  { value: "medium", label: "Medium (5-6 sentences)", description: "Balanced summary" },
  { value: "detailed", label: "Detailed (7-8 sentences)", description: "Comprehensive summary" },
]

const commonSEBIUrls = [
  {
    title: "Investor Education and Protection Fund",
    url: "https://www.sebi.gov.in/investors/investor-education-and-protection-fund.html",
    category: "Education",
  },
  {
    title: "Mutual Fund Guidelines",
    url: "https://www.sebi.gov.in/legal/regulations/mutual-funds-regulations.html",
    category: "Regulations",
  },
  {
    title: "Stock Exchange Guidelines",
    url: "https://www.sebi.gov.in/legal/regulations/stock-exchanges-regulations.html",
    category: "Trading",
  },
]

export function EnhancedTranslator() {
  const [activeTab, setActiveTab] = useState("url")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState("hi")
  const [summaryLength, setSummaryLength] = useState<"short" | "medium" | "detailed">("medium")
  const [includeKeyPoints, setIncludeKeyPoints] = useState(true)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<DocumentSummary | null>(null)
  const [error, setError] = useState("")
  const { t } = useLanguage()

  const selectedLanguage = supportedLanguages.find((lang) => lang.code === targetLanguage)

  const processDocument = async () => {
    if (!url.trim() && !text.trim()) {
      setError("Please provide either a URL or text content to process.")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      let content = text.trim()

      if (url.trim() && !content) {
        // In a real implementation, this would fetch the URL content
        // For demo purposes, we'll use sample content based on URL type
        const sourceType = DocumentProcessor.detectSourceType(url)
        content = getSampleContent(sourceType)
      }

      const options: ProcessingOptions = {
        targetLanguage: selectedLanguage?.name || "Hindi",
        summaryLength,
        includeKeyPoints,
        preserveNumbers: true,
      }

      const summary = await DocumentProcessor.processDocument(content, url.trim() || undefined, options)
      setResult(summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while processing the document.")
    } finally {
      setLoading(false)
    }
  }

  const getSampleContent = (sourceType: string): string => {
    const sampleContents = {
      sebi: "SEBI (Securities and Exchange Board of India) is the regulatory authority for the securities market in India. It was established in 1988 and given statutory powers in 1992. SEBI's primary functions include protecting investor interests, promoting the development of securities market, and regulating the securities market. The board consists of a chairman and several members appointed by the Government of India. SEBI regulates mutual funds, stock exchanges, brokers, and other market intermediaries to ensure fair and transparent trading practices.",
      nism: "NISM (National Institute of Securities Markets) is an educational initiative of SEBI established in 2006. It conducts various certification programs for professionals working in the securities markets. NISM offers courses on mutual fund operations, equity derivatives, currency derivatives, research analysis, and investment advisory services. These certifications are mandatory for professionals in respective areas and help maintain professional standards in the securities market.",
      nse: "NSE (National Stock Exchange) is India's leading stock exchange established in 1992. It introduced electronic trading in India and operates the NIFTY index. NSE provides trading in equity, derivatives, currency, and debt segments. The exchange uses advanced technology for price discovery and trade execution, ensuring transparency and efficiency in the Indian capital markets.",
      bse: "BSE (Bombay Stock Exchange) is Asia's oldest stock exchange established in 1875. It operates the SENSEX index and provides trading platform for equity, derivatives, and mutual funds. BSE has played a crucial role in the development of Indian capital markets and continues to be an important trading venue for investors.",
      other:
        "This document contains important financial information that investors should understand before making investment decisions. It covers various aspects of securities markets, investment risks, and regulatory guidelines that help protect investor interests.",
    }

    return sampleContents[sourceType as keyof typeof sampleContents] || sampleContents.other
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadSummary = () => {
    if (!result) return

    const content = `
Document Summary
================

Original Language: English
Target Language: ${result.language}
Source Type: ${result.sourceType.toUpperCase()}
Confidence: ${(result.confidence * 100).toFixed(0)}%

Summary:
${result.summary}

Translated Summary:
${result.translatedSummary}

Key Financial Terms:
${result.keyPoints.join(", ")}

Generated on: ${new Date().toLocaleString()}
    `.trim()

    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `summary-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Processing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Document Translation & Summarization
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Language and Options */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Language</label>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {supportedLanguages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name} ({lang.native})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Summary Length</label>
              <Select value={summaryLength} onValueChange={(value) => setSummaryLength(value as any)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {summaryLengths.map((length) => (
                    <SelectItem key={length.value} value={length.value}>
                      {length.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Input Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="url">URL Input</TabsTrigger>
              <TabsTrigger value="text">Text Input</TabsTrigger>
              <TabsTrigger value="samples">Sample Documents</TabsTrigger>
            </TabsList>

            <TabsContent value="url" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document URL</label>
                <Input
                  type="url"
                  placeholder="https://www.sebi.gov.in/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <p className="text-xs text-slate-600">Supports SEBI, NISM, NSE, BSE, and RBI official documents</p>
              </div>
            </TabsContent>

            <TabsContent value="text" className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Document Text</label>
                <Textarea
                  placeholder="Paste the document content here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={8}
                />
              </div>
            </TabsContent>

            <TabsContent value="samples" className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Sample SEBI Documents</label>
                {commonSEBIUrls.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium text-sm">{doc.title}</h4>
                      <Badge variant="outline" className="mt-1">
                        {doc.category}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setUrl(doc.url)
                        setActiveTab("url")
                      }}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Process Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={processDocument}
              disabled={loading || (!url.trim() && !text.trim())}
              className="bg-sky-600 hover:bg-sky-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Process Document
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="keyPoints"
                checked={includeKeyPoints}
                onChange={(e) => setIncludeKeyPoints(e.target.checked)}
              />
              <label htmlFor="keyPoints" className="text-sm">
                Extract key financial terms
              </label>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {result && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                Processing Complete
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{result.sourceType.toUpperCase()}</Badge>
                <Badge variant="outline">{(result.confidence * 100).toFixed(0)}% confidence</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">English Summary</h3>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.summary)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="leading-relaxed">{result.summary}</p>
              </div>
            </div>

            {/* Translated Summary */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{selectedLanguage?.name} Translation</h3>
                <Button variant="outline" size="sm" onClick={() => copyToClipboard(result.translatedSummary)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="leading-relaxed">{result.translatedSummary}</p>
              </div>
            </div>

            {/* Key Terms */}
            {result.keyPoints.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium">Key Financial Terms</h3>
                <div className="flex flex-wrap gap-2">
                  {result.keyPoints.map((term, index) => (
                    <Badge key={index} variant="secondary">
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4 border-t">
              <Button variant="outline" onClick={downloadSummary}>
                <Download className="h-4 w-4 mr-2" />
                Download Summary
              </Button>

              <Alert className="flex-1">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  This is an AI-generated summary for educational purposes. Always verify with original sources.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
