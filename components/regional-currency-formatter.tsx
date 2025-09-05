"use client"

import { useLanguage } from "@/contexts/language-context"

interface CurrencyFormatterProps {
  amount: number
  className?: string
}

export function CurrencyFormatter({ amount, className = "" }: CurrencyFormatterProps) {
  const { language } = useLanguage()

  // Format currency based on Indian standards
  const formatCurrency = (value: number) => {
    // Indian numbering system (lakhs and crores)
    if (value >= 10000000) {
      return `₹${(value / 10000000).toFixed(2)} Cr`
    } else if (value >= 100000) {
      return `₹${(value / 100000).toFixed(2)} L`
    } else if (value >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`
    } else {
      return `₹${value.toFixed(2)}`
    }
  }

  return <span className={`font-mono ${className}`}>{formatCurrency(amount)}</span>
}
