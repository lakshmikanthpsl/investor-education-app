"use client"

import { useState, useEffect } from "react"
import { offlineStorage } from "@/lib/offline-storage"

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  useEffect(() => {
    // Initialize offline storage
    offlineStorage.init().catch(console.error)

    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // PWA install prompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    }
  }, [])

  const installApp = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setIsInstallable(false)
      setDeferredPrompt(null)
    }
  }

  const syncOfflineData = async () => {
    if (!isOnline) return

    try {
      // Sync progress data
      const progress = await offlineStorage.getData("progress", "user")
      if (progress) {
        // In a real app, sync with server
        console.log("Syncing progress data:", progress)
      }

      // Sync portfolio data
      const portfolio = await offlineStorage.getData("portfolio", "user")
      if (portfolio) {
        console.log("Syncing portfolio data:", portfolio)
      }
    } catch (error) {
      console.error("Failed to sync offline data:", error)
    }
  }

  return {
    isOnline,
    isInstallable,
    installApp,
    syncOfflineData,
  }
}
