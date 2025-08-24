"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BarChart3, Bell, Crown } from "lucide-react"
import { useAppStore } from "@/lib/store"
import MobileNavigation from "./mobile-navigation"

export default function MobileOptimizedHeader() {
  const { user, isPremium, unreadCount, setShowNotifications, setShowProfile } = useAppStore()

  return (
    <header className="border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50 mobile-safe-area">
      <div className="container mx-auto px-3 py-3">
        <div className="flex items-center justify-between">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-3">
            <MobileNavigation />
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-500" />
              <h1 className="text-lg sm:text-2xl font-bold">TradePro</h1>
            </div>
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-xs hidden sm:inline-flex">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
            )}
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowNotifications(true)}
              className="relative mobile-friendly-button"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Button>
            <Avatar className="cursor-pointer h-8 w-8 sm:h-10 sm:w-10 mobile-tap" onClick={() => setShowProfile(true)}>
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback className="text-xs sm:text-sm">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  )
}
