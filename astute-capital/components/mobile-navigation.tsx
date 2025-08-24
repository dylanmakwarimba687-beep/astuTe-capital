"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import {
  Menu,
  Home,
  Activity,
  Zap,
  Wallet,
  Trophy,
  Briefcase,
  Target,
  Settings,
  User,
  Bell,
  Crown,
  LogOut,
  ShieldCheck,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { activeTab, setActiveTab, user, isPremium, logout, setShowNotifications, setShowSettings, setShowProfile } =
    useAppStore()
  const router = useRouter()

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "trading", label: "Trading", icon: Activity },
    { id: "signals", label: "AI Signals", icon: Zap },
    { id: "portfolio", label: "Portfolio", icon: Wallet },
    { id: "competitions", label: "Competitions", icon: Trophy },
    { id: "challenges", label: "Prop Challenges", icon: Briefcase },
    { id: "news", label: "Market Analysis", icon: Target },
  ]

  const handleNavigation = (tabId: string) => {
    setActiveTab(tabId)
    setIsOpen(false)
  }

  const handleLogout = () => {
    logout()
    setIsOpen(false)
  }

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-slate-900 border-slate-700">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center space-x-3 p-4 border-b border-slate-700">
              <div className="h-10 w-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">AC</span>
              </div>
              <div>
                <h2 className="text-white font-semibold">Astute Capital</h2>
                <p className="text-slate-400 text-sm">Trading Platform</p>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-slate-700">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-slate-400 text-xs">{user?.email}</p>
                </div>
                {isPremium && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                    <Crown className="h-3 w-3 mr-1" />
                    Pro
                  </Badge>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start text-left ${
                        isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.label}
                    </Button>
                  )
                })}
              </nav>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-slate-700 p-4 space-y-2">
              {user?.role === "admin" && (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-emerald-400 hover:text-emerald-300 hover:bg-emerald-900/20"
                  onClick={() => {
                    router.push("/admin/challenges")
                    setIsOpen(false)
                  }}
                >
                  <ShieldCheck className="h-5 w-5 mr-3" />
                  Admin Board
                </Button>
              )}
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => {
                  setShowNotifications(true)
                  setIsOpen(false)
                }}
              >
                <Bell className="h-5 w-5 mr-3" />
                Notifications
                <span className="ml-auto h-2 w-2 bg-red-500 rounded-full"></span>
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => {
                  setShowSettings(true)
                  setIsOpen(false)
                }}
              >
                <Settings className="h-5 w-5 mr-3" />
                Settings
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => {
                  setShowProfile(true)
                  setIsOpen(false)
                }}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
                onClick={handleLogout}
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
