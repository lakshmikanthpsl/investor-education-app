"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Video, Sparkles, Clock, Play, Loader2, AlertCircle, Settings } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"

interface GeneratedVideo {
  id: string
  title: string
  description: string
  script: string
  duration: string
  keyPoints: string[]
  createdAt: Date
}

export function VideoGenerator() {
  const { t } = useLanguage()
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedVideos, setGeneratedVideos] = useState<GeneratedVideo[]>([])
  const [error, setError] = useState<string | null>(null)

  const examplePrompts = [
    t.videos.examples.basicStocks,
    t.videos.examples.riskManagement,
    t.videos.examples.technicalAnalysis,
    t.videos.examples.mutualFunds,
  ]

  const generateMockVideo = (userPrompt: string): GeneratedVideo => {
    const mockVideos = {
      stock: {
        title: "Understanding Stock Market Basics",
        description: "A comprehensive guide to stock market fundamentals for beginners",
        script: `Welcome to Stock Market Basics!\n\nIn this video, we'll cover the essential concepts every investor should know.\n\nWhat are stocks?\nStocks represent ownership shares in a company. When you buy a stock, you become a partial owner of that business.\n\nHow does the stock market work?\nThe stock market is like a marketplace where buyers and sellers trade stocks. Prices go up and down based on supply and demand.\n\nKey terms to remember:\n- Share: A unit of ownership in a company\n- Dividend: Payments made to shareholders\n- Market Cap: Total value of a company's shares\n\nRemember: Always do your research before investing, and never invest more than you can afford to lose.\n\nThank you for watching!`,
        duration: "5-7 minutes",
        keyPoints: [
          "Stocks represent ownership in companies",
          "Stock prices fluctuate based on supply and demand",
          "Always research before investing",
          "Only invest what you can afford to lose",
        ],
      },
      risk: {
        title: "Investment Risk Management Strategies",
        description: "Learn how to protect your investments and manage risk effectively",
        script: `Risk Management in Investing\n\nEvery investment carries risk, but smart investors know how to manage it.\n\nTypes of Investment Risk:\n1. Market Risk - Overall market fluctuations\n2. Company Risk - Specific to individual companies\n3. Inflation Risk - Purchasing power erosion\n\nRisk Management Strategies:\n\nDiversification: Don't put all eggs in one basket. Spread investments across different sectors and asset classes.\n\nAsset Allocation: Balance between stocks, bonds, and other investments based on your risk tolerance.\n\nRegular Review: Monitor your portfolio and rebalance periodically.\n\nEmergency Fund: Keep 3-6 months of expenses in liquid savings.\n\nRemember: Higher returns usually come with higher risk. Find the right balance for your situation.`,
        duration: "6-8 minutes",
        keyPoints: [
          "Diversification reduces overall portfolio risk",
          "Asset allocation should match your risk tolerance",
          "Regular portfolio review is essential",
          "Maintain an emergency fund for security",
        ],
      },
    }

    // Simple keyword matching for mock responses
    const prompt = userPrompt.toLowerCase()
    if (prompt.includes("stock") || prompt.includes("share")) {
      return { ...mockVideos.stock, id: Date.now().toString(), createdAt: new Date() }
    } else if (prompt.includes("risk") || prompt.includes("manage")) {
      return { ...mockVideos.risk, id: Date.now().toString(), createdAt: new Date() }
    }

    // Default response
    return {
      id: Date.now().toString(),
      title: "Investment Education Video",
      description: "A personalized educational video based on your query",
      script: `Educational Content: ${userPrompt}\n\nThis is a sample educational video script that would be generated based on your specific query about "${userPrompt}".\n\nKey concepts would be explained in simple terms with practical examples and actionable advice.\n\nThe content would be tailored to Indian market context where relevant, with appropriate disclaimers about investment risks.\n\nRemember to always consult with financial advisors for personalized investment advice.`,
      duration: "4-6 minutes",
      keyPoints: [
        "Educational content tailored to your query",
        "Simple explanations with practical examples",
        "Indian market context included",
        "Investment risk disclaimers provided",
      ],
      createdAt: new Date(),
    }
  }

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setError(null)

    try {
      if (!process.env.GROQ_API_KEY) {
        // Use mock data when API key is not available
        const mockVideo = generateMockVideo(prompt)
        setGeneratedVideos((prev) => [mockVideo, ...prev])
        setPrompt("")
        return
      }

      const { text } = await generateText({
        model: groq("llama-3.1-70b-versatile"),
        prompt: `Create an educational video script about: "${prompt}"

Please provide a JSON response with the following structure:
{
  "title": "Engaging video title",
  "description": "Brief description of what the video covers",
  "script": "Detailed video script with clear explanations, examples, and educational content. Make it engaging and easy to understand for beginners.",
  "duration": "Estimated duration (e.g., '5-7 minutes')",
  "keyPoints": ["Key point 1", "Key point 2", "Key point 3"]
}

Focus on:
- Clear, simple explanations suitable for beginners
- Real-world examples and analogies
- Practical tips and actionable advice
- Indian market context where relevant
- Educational disclaimers about investment risks`,
      })

      const videoData = JSON.parse(text)
      const newVideo: GeneratedVideo = {
        id: Date.now().toString(),
        ...videoData,
        createdAt: new Date(),
      }

      setGeneratedVideos((prev) => [newVideo, ...prev])
      setPrompt("")
    } catch (error) {
      console.error("Error generating video:", error)
      setError("Unable to connect to AI service. Using sample content instead.")
      const mockVideo = generateMockVideo(prompt)
      setGeneratedVideos((prev) => [mockVideo, ...prev])
      setPrompt("")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Video className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-slate-900">{t.videos.title}</h1>
        </div>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">{t.videos.description}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {t.videos.features.aiGenerated}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Video className="h-3 w-3" />
            {t.videos.features.customTopics}
          </Badge>
        </div>
      </div>

      {!process.env.GROQ_API_KEY && (
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <strong>Setup Required:</strong> To enable AI-powered video generation, please add the Groq integration in
            your project settings. Currently showing sample content for demonstration.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Video Generation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            Generate Educational Video
          </CardTitle>
          <CardDescription>
            Describe what investment topic you'd like to learn about, and we'll create a personalized educational video
            script for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t.videos.prompt.placeholder}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[100px] resize-none"
          />

          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700">{t.videos.examples.title}:</p>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <Button key={index} variant="outline" size="sm" onClick={() => setPrompt(example)} className="text-xs">
                  {example}
                </Button>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} disabled={!prompt.trim() || isGenerating} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {t.videos.prompt.generating}
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                {t.videos.prompt.generate}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Videos */}
      {generatedVideos.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">Your Generated Videos</h2>
          <div className="grid gap-6">
            {generatedVideos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <CardTitle className="text-xl">{video.title}</CardTitle>
                      <CardDescription className="text-base">{video.description}</CardDescription>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {video.duration}
                        </div>
                        <div>Created: {video.createdAt.toLocaleDateString()}</div>
                      </div>
                    </div>
                    <Button size="sm" className="flex-shrink-0">
                      <Play className="h-4 w-4 mr-2" />
                      Watch
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Key Points:</h4>
                    <ul className="space-y-1">
                      {video.keyPoints.map((point, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                          <span className="text-blue-600 font-bold">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Video Script:</h4>
                    <div className="bg-slate-50 rounded-lg p-4 max-h-60 overflow-y-auto">
                      <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{video.script}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
