"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LiveSignalFeed } from "@/components/live-signal-feed"
import { PremiumSignalCustomization } from "@/components/premium-signal-customization"
import { TrendingUp, TrendingDown, Zap, Settings, Bell, BarChart3 } from "lucide-react"

interface SignalData {
  id: string
  symbol: string
  type: "BUY" | "SELL"
  price: number
  targetPrice: number
  stopLoss: number
  confidence: number
  timeframe: string
  analysis: string
  timestamp: Date
  priority: "HIGH" | "MEDIUM" | "LOW"
  category: "FOREX" | "CRYPTO" | "STOCKS" | "COMMODITIES"
}

export default function SignalsPage() {
  const [signals, setSignals] = useState<SignalData[]>([])
  const [isPremium] = useState(true) // Demo premium access
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(false)

  useEffect(() => {
    // Initialize with some demo signals
    const initialSignals: SignalData[] = [
      {
        id: "1",
        symbol: "EUR/USD",
        type: "BUY",
        price: 1.0875,
        targetPrice: 1.0925,
        stopLoss: 1.0825,
        confidence: 85,
        timeframe: "4H",
        analysis: "Strong bullish momentum with RSI oversold recovery",
        timestamp: new Date(),
        priority: "HIGH",
        category: "FOREX",
      },
      {
        id: "2",
        symbol: "BTC/USD",
        type: "SELL",
        price: 43250,
        targetPrice: 42500,
        stopLoss: 43800,
        confidence: 78,
        timeframe: "1H",
        analysis: "Bearish divergence on MACD, potential correction",
        timestamp: new Date(Date.now() - 300000),
        priority: "MEDIUM",
        category: "CRYPTO",
      },
    ]
    setSignals(initialSignals)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 p-4">
      <div className="container mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Trading Signals</h1>
            <p className="text-slate-400">AI-powered trading signals with real-time analysis</p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCustomizationOpen(true)}
              className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
            >
              <Settings className="w-4 h-4 mr-2" />
              Customize
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-500 text-blue-400 hover:bg-blue-500/10 bg-transparent"
            >
              <Bell className="w-4 h-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>

        {/* Premium Status */}
        {isPremium && (
          <Card className="bg-gradient-to-r from-emerald-900/50 to-blue-900/50 border-emerald-500/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
                  <Zap className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Premium Active</h3>
                  <p className="text-sm text-slate-300">Access to all premium signals and features</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Live Signal Feed */}
          <div className="lg:col-span-2">
            <LiveSignalFeed signals={signals} setSignals={setSignals} isPremium={isPremium} />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Performance Stats */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Win Rate</span>
                  <span className="text-emerald-400 font-semibold">78.5%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Avg. Return</span>
                  <span className="text-blue-400 font-semibold">+2.4%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Active Signals</span>
                  <span className="text-white font-semibold">{signals.length}</span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View All Signals
                </Button>
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 bg-transparent">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Signal History
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Customization Panel */}
        <PremiumSignalCustomization
          isOpen={isCustomizationOpen}
          onClose={() => setIsCustomizationOpen(false)}
          isPremium={isPremium}
        />
      </div>
    </div>
  )
}
