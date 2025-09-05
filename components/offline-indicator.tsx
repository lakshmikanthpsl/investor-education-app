"use client"

import { useOffline } from "@/hooks/use-offline"
import { WifiOff, Download, Send as Sync } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

export function OfflineIndicator() {
  const { isOnline, isInstallable, installApp, syncOfflineData } = useOffline()
  const { t } = useLanguage()

  if (isOnline && !isInstallable) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {/* Offline Status */}
      {!isOnline && (
        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="flex items-center gap-2 p-3">
            <WifiOff className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-800">{t.pwa.offline_mode}</span>
          </CardContent>
        </Card>
      )}

      {/* Install App Prompt */}
      {isInstallable && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 mb-2">
              <Download className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">{t.pwa.install_app}</span>
            </div>
            <Button size="sm" onClick={installApp} className="w-full">
              {t.pwa.install}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Sync Button */}
      {isOnline && (
        <Button size="sm" variant="outline" onClick={syncOfflineData} className="bg-white shadow-lg">
          <Sync className="h-4 w-4 mr-1" />
          {t.pwa.sync}
        </Button>
      )}
    </div>
  )
}
