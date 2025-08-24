"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
  ChevronRight,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

export default function EnhancedMobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const {
    activeTab,
    setActiveTab,
    user,
    isPremium,
    isDemoMode,
    logout,
    setShowNotifications,
    setShowSettings,
    setShowProfile,
  } = useAppStore()

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      description: "Overview & Analytics",
      badge: null,
    },
    {
      id: "trading",
      label: "Trading",
      icon: Activity,
      description: "Execute Trades",
      badge: null,
    },
    {
      id: "signals",
      label: "AI Signals",
      icon: Zap,
      description: "Smart Trading Alerts",
      badge: "12 Active",
    },
    {
      id: "portfolio",
      label: "Portfolio",
      icon: Wallet,
      description: "Track Performance",
      badge: null,
    },
    {
      id: "competitions",
      label: "Competitions",
      icon: Trophy,
      description: "Trading Contests",
      badge: "3 Active",
    },
    {
      id: "challenges",
      label: "Prop Challenges",
      icon: Briefcase,
      description: "Get Funded",
      badge: "New",
    },
    {
      id: "news",
      label: "Market Analysis",
      icon: Target,
      description: "Research & Insights",
      badge: null,
    },
  ]

  const quickStats = [
    { label: "Portfolio Value", value: "$125,420", change: "+2.31%", positive: true },
    { label: "Today's P&L", value: "$2,840", change: "+1.89%", positive: true },
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
          <Button variant="ghost" size="icon" className="text-white relative">
            <Menu className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-slate-900 border-slate-700 p-0">
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-600 to-emerald-700">
              <div className="flex items-center space-x-3 mb-4">
                <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">AC</span>
                </div>
                <div>
                  <h2 className="text-white font-bold text-lg">AstuteCapital</h2>
                  <p className="text-emerald-100 text-sm">Professional Trading Platform</p>
                </div>
                {isPremium && (
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                )}
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-emerald-100 text-sm">{user?.email}</p>
                </div>
              </div>

              {/* Demo Mode Indicator */}
              {isDemoMode && (
                <div className="mt-3 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-100 text-xs font-medium">Demo Mode Active</p>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="p-4 bg-slate-800">
              <h3 className="text-white text-sm font-medium mb-3">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                {quickStats.map((stat, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-3">
                    <p className="text-slate-400 text-xs">{stat.label}</p>
                    <p className="text-white font-bold text-sm">{stat.value}</p>
                    <p className={`text-xs ${stat.positive ? "text-green-400" : "text-red-400"}`}>{stat.change}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="bg-slate-700" />

            {/* Navigation */}
            <div className="flex-1 py-4">
              <nav className="space-y-1 px-4">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = activeTab === item.id
                  return (
                    <Button
                      key={item.id}
                      variant="ghost"
                      className={`w-full justify-start text-left h-auto p-3 ${
                        isActive ? "bg-emerald-600 text-white" : "text-slate-300 hover:text-white hover:bg-slate-800"
                      }`}
                      onClick={() => handleNavigation(item.id)}
                    >
                      <div className="flex items-center w-full">
                        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
                        <div className="flex-1 text-left">
                          <div className="font-medium">{item.label}</div>
                          <div className="text-xs opacity-70">{item.description}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {item.badge && <Badge className="bg-emerald-600 text-white text-xs">{item.badge}</Badge>}
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </nav>
            </div>

            <Separator className="bg-slate-700" />

            {/* Quick Actions */}
            <div className="p-4 space-y-2">
              <h3 className="text-white text-sm font-medium mb-3">Quick Actions</h3>
              <Button
                variant="ghost"
                className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
                onClick={() => {
                  setShowNotifications(true)
                  setIsOpen(false)
                }}
              >
                <Bell className="h-5 w-5 mr-3" />
                <span className="flex-1 text-left">Notifications</span>
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
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

              <Separator className="bg-slate-700 my-3" />

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
