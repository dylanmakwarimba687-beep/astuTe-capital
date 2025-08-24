"use client"

import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Info, X, Play, User } from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function DemoModeBanner() {
  const { isDemoMode, setDemoMode } = useAppStore()
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  if (!isDemoMode || !isVisible) return null

  const handleExitDemo = () => {
    setDemoMode(false)
    router.push("/auth/login")
  }

  return (
    <Alert className="border-blue-500/20 bg-blue-500/10 mb-4 mx-3 sm:mx-4">
      <Info className="h-4 w-4 text-blue-400" />
      <div className="flex items-center justify-between w-full">
        <div className="flex-1">
          <AlertDescription className="text-blue-400 flex items-center gap-2">
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              <Play className="h-3 w-3 mr-1" />
              Demo Mode
            </Badge>
            You're exploring TradePro with sample data.
            <span className="hidden sm:inline">Create an account to start real trading.</span>
          </AlertDescription>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Button
            size="sm"
            variant="outline"
            className="border-blue-400 text-blue-400 hover:bg-blue-400 hover:text-white bg-transparent"
            onClick={() => router.push("/auth/signup")}
          >
            <User className="h-3 w-3 mr-1" />
            Sign Up
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-blue-400 hover:text-blue-300"
            onClick={() => setIsVisible(false)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Alert>
  )
}
