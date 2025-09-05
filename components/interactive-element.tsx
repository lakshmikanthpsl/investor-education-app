"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface InteractiveElementProps {
  element: {
    type: "slider" | "calculator" | "simulation" | "drag-drop"
    config: any
  }
}

export function InteractiveElement({ element }: InteractiveElementProps) {
  const [values, setValues] = useState<Record<string, number>>({})
  const [result, setResult] = useState<number | null>(null)

  if (element.type === "calculator" && element.config.inputs) {
    return (
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">Interactive Calculator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {element.config.inputs.map((input: string) => (
            <div key={input} className="space-y-2">
              <Label htmlFor={input} className="capitalize">
                {input.replace("_", " ")}
              </Label>
              <Input
                id={input}
                type="number"
                placeholder={`Enter ${input.replace("_", " ")}`}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    [input]: Number.parseFloat(e.target.value) || 0,
                  }))
                }
              />
            </div>
          ))}

          <Button
            onClick={() => {
              // Simple calculation based on ownership percentage
              if (element.config.formula && values.investment_amount && values.share_price && values.total_shares) {
                const shares = values.investment_amount / values.share_price
                const ownership = (shares / values.total_shares) * 100
                setResult(ownership)
              }
            }}
            className="w-full"
          >
            Calculate
          </Button>

          {result !== null && (
            <div className="p-4 bg-white rounded-lg border">
              <p className="font-medium">Result: {result.toFixed(4)}% ownership</p>
              <p className="text-sm text-slate-600 mt-1">
                You would own {result.toFixed(4)}% of the company with this investment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  if (element.type === "simulation") {
    return (
      <Card className="bg-purple-50 border-purple-200">
        <CardHeader>
          <CardTitle className="text-purple-800">Interactive Simulation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="h-32 w-full bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg flex items-center justify-center mb-4">
              <p className="text-slate-600">Simulation visualization would appear here</p>
            </div>
            <p className="text-sm text-slate-600">Interactive {element.config.type} simulation</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-50 border-gray-200">
      <CardContent className="py-6">
        <p className="text-center text-gray-600">Interactive element: {element.type}</p>
      </CardContent>
    </Card>
  )
}
