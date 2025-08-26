"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Zap, Target, PieChart, Bell, Settings, User, Trophy, Crown, Wallet, Briefcase } from "lucide-react"
import { useAppStore } from "@/lib/store"
import AuthGuard from "@/components/auth-guard"
import ResponsiveLayout from "@/components/responsive-layout"
import DemoModeBanner from "@/components/demo-mode-banner"
import DemoTour from "@/components/demo-tour"
import NotificationsPanel from "@/components/notifications-panel"
import SettingsPanel from "@/components/settings-panel"
import ProfilePanel from "@/components/profile-panel"

// Import page components
import DashboardPage from "@/app/dashboard/page"
import TradingPage from "@/app/trading/page"
import SignalsPage from "@/app/signals/page"
import PortfolioPage from "@/app/portfolio/page"
import CompetitionsPage from "@/app/competitions/page"
import ChallengesPage from "@/app/challenges/page"
import NewsPage from "@/app/news/page"

export default function HomePage() {
  const router = useRouter()
  const {
    activeTab,
    setActiveTab,
    user,
    isPremium,
    isDemo,
    showNotifications,
    showSettings,
    showProfile,
    setShowNotifications,
    setShowSettings,
    setShowProfile,
    isAuthenticated,
    isDemoMode,
  } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login")
    }
  }, [isAuthenticated, router])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardPage />
      case "trading":
        return <TradingPage />
      case "signals":
        return <SignalsPage />
      case "portfolio":
        return <PortfolioPage />
      case "competitions":
        return <CompetitionsPage />
      case "challenges":
        return <ChallengesPage />
      case "news":
        return <NewsPage />
      default:
        return <DashboardPage />
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <AuthGuard>
      <ResponsiveLayout>
        <div className="space-y-6">
          {(isDemoMode || isDemo) && <DemoModeBanner />}

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Welcome back, {user?.firstName || "Trader"}!
              </h1>
              <p className="text-slate-400 mt-1">
                {isDemoMode || isDemo ? "Demo Mode - Practice with virtual funds" : "Ready to make your next move?"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {isPremium && (
                <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500">
                  <Crown className="h-3 w-3 mr-1" />
                  Premium
                </Badge>
              )}
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" onClick={() => setShowNotifications(true)} className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowSettings(true)}>
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setShowProfile(true)}>
                  <User className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 md:grid-cols-7 bg-slate-800">
              <TabsTrigger value="dashboard" className="data-[state=active]:bg-emerald-600">
                <PieChart className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
              <TabsTrigger value="trading" className="data-[state=active]:bg-emerald-600">
                <Activity className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Trading</span>
              </TabsTrigger>
              <TabsTrigger value="signals" className="data-[state=active]:bg-emerald-600">
                <Zap className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Signals</span>
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="data-[state=active]:bg-emerald-600">
                <Wallet className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Portfolio</span>
              </TabsTrigger>
              <TabsTrigger value="competitions" className="data-[state=active]:bg-emerald-600">
                <Trophy className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Competitions</span>
              </TabsTrigger>
              <TabsTrigger value="challenges" className="data-[state=active]:bg-emerald-600">
                <Briefcase className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Challenges</span>
              </TabsTrigger>
              <TabsTrigger value="news" className="data-[state=active]:bg-emerald-600">
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Analysis</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab}>{renderActiveTab()}</TabsContent>
          </Tabs>

          {/* Panels */}
          <NotificationsPanel open={showNotifications} onClose={() => setShowNotifications(false)} />
          <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />
          <ProfilePanel open={showProfile} onClose={() => setShowProfile(false)} />

          {/* Demo Tour */}
          {(isDemoMode || isDemo) && <DemoTour />}
        </div>
      </ResponsiveLayout>
    </AuthGuard>
  )
}
