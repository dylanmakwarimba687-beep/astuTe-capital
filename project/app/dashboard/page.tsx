"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Eye, EyeOff, Wallet, Zap, Trophy } from "lucide-react"
import { useAppStore } from "@/lib/store"
import RealTimeChart from "@/components/real-time-chart"
import MarketTicker from "@/components/market-ticker"

export default function DashboardPage() {
  const { user, isPremium, isDemoMode } = useAppStore()
  const [balanceVisible, setBalanceVisible] = useState(true)

  // Mock portfolio data
  const portfolioData = {
    totalValue: 125420.5,
    dayChange: 2840.25,
    dayChangePercent: 2.31,
    positions: [
      { symbol: "AAPL", shares: 100, value: 18500, change: 2.4 },
      { symbol: "GOOGL", shares: 50, value: 15200, change: -1.2 },
      { symbol: "TSLA", shares: 75, value: 22100, change: 4.8 },
      { symbol: "MSFT", shares: 120, value: 41800, change: 1.9 },
    ],
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Portfolio</CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 text-slate-400 hover:text-white"
              onClick={() => setBalanceVisible(!balanceVisible)}
            >
              {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {balanceVisible ? `$${portfolioData.totalValue.toLocaleString()}` : "••••••"}
            </div>
            <div className="flex items-center space-x-1 text-sm">
              {portfolioData.dayChange >= 0 ? (
                <ArrowUpRight className="h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
              <span className={portfolioData.dayChange >= 0 ? "text-green-500" : "text-red-500"}>
                {balanceVisible
                  ? `$${Math.abs(portfolioData.dayChange).toLocaleString()} (${Math.abs(
                      portfolioData.dayChangePercent,
                    )}%)`
                  : "••••••"}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Active Positions</CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{portfolioData.positions.length}</div>
            <p className="text-xs text-slate-400">Across multiple markets</p>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">AI Signals</CardTitle>
            <Zap className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">12</div>
            <p className="text-xs text-emerald-400">89% accuracy rate</p>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Competitions</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">3</div>
            <p className="text-xs text-yellow-400">Active entries</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Market Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-white">Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <RealTimeChart />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-white text-sm">Market Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <MarketTicker />
            </CardContent>
          </Card>

          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-white text-sm">Top Positions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {portfolioData.positions.map((position) => (
                <div key={position.symbol} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-white">{position.symbol}</p>
                    <p className="text-xs text-slate-400">{position.shares} shares</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-white">${position.value.toLocaleString()}</p>
                    <p className={`text-xs ${position.change >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {position.change >= 0 ? "+" : ""}
                      {position.change}%
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card className="trading-card">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Bought 50 shares of AAPL</p>
                <p className="text-xs text-slate-400">2 hours ago</p>
              </div>
              <p className="text-sm text-green-500">+$9,250</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">AI Signal: TSLA Buy Alert</p>
                <p className="text-xs text-slate-400">4 hours ago</p>
              </div>
              <Badge className="bg-emerald-600">Active</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-2 w-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-white">Sold 25 shares of GOOGL</p>
                <p className="text-xs text-slate-400">1 day ago</p>
              </div>
              <p className="text-sm text-red-500">-$3,800</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
