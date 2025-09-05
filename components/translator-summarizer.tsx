"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const languages = [
  "Hindi",
  "Bengali",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Gujarati",
  "Malayalam",
  "Punjabi",
  "Odia",
] as const
type Lang = (typeof languages)[number]

export function TranslatorSummarizer() {
  const [target, setTarget] = useState<Lang>("Hindi")
  const [url, setUrl] = useState("")
  const [text, setText] = useState("")
  const [loading, setLoading] = useState(false)
  const [out, setOut] = useState("")

  const canSubmit = url.trim().length > 0 || text.trim().length > 0

  const submit = async () => {
    if (!canSubmit) {
      setOut("Please paste a valid URL or some source text to summarize.")
      return
    }
    setOut("")
    setLoading(true)
    try {
      const res = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() || undefined, text: text.trim() || undefined, targetLang: target }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed")
      setOut(data.summary)
    } catch (e: any) {
      setOut(
        `Error: ${e.message}. Try another URL or paste the text directly. Offline summarizer works without any AI keys.`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="py-6 grid gap-4">
        <div className="grid gap-1">
          <label className="text-sm text-slate-600">Target language</label>
          <select
            className="h-9 w-48 rounded border border-slate-300 px-2"
            value={target}
            onChange={(e) => setTarget(e.target.value as Lang)}
          >
            {languages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-slate-600">Source URL (optional)</label>
          <input
            type="url"
            placeholder="https://www.sebi.gov.in/..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-9 w-full rounded border border-slate-300 px-2"
          />
          <span className="text-xs text-slate-500">Or paste text below.</span>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-slate-600">Source text (optional)</label>
          <textarea
            rows={6}
            placeholder="Paste relevant educational content for summary/translation..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full rounded border border-slate-300 p-2"
          />
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-sky-600 hover:bg-sky-700" onClick={submit} disabled={loading || !canSubmit}>
            {loading ? "Summarizing..." : "Summarize & Translate"}
          </Button>
          <span className="text-sm text-slate-600">For education; verify with the original source.</span>
        </div>

        {out && (
          <div className="grid gap-2" aria-live="polite">
            {out.startsWith("[Offline") && (
              <div className="text-xs text-slate-600">
                Offline mode active. Add an AI integration later for higher quality translations.
              </div>
            )}
            <label className="text-sm text-slate-600">Output</label>
            <div className="rounded border border-slate-300 p-3 leading-relaxed text-slate-800 bg-white">{out}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
