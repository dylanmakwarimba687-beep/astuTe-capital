"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Play, Pause, Clock, Target, Shield } from "lucide-react"

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

interface LiveSignalFeedProps {
  signals: SignalData[]
  setSignals: (signals: SignalData[]) => void
  isPremium: boolean
}

export function LiveSignalFeed({ signals, setSignals, isPremium }: LiveSignalFeedProps) {
  const [isLive, setIsLive] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const generateNewSignal = useCallback((): SignalData => {
    const symbols = ["EUR/USD", "GBP/USD", "USD/JPY", "BTC/USD", "ETH/USD", "AAPL", "TSLA", "GOLD"]
    const categories: SignalData["category"][] = ["FOREX", "CRYPTO", "STOCKS", "COMMODITIES"]
    const priorities: SignalData["priority"][] = ["HIGH", "MEDIUM", "LOW"]
    const types: SignalData["type"][] = ["BUY", "SELL"]

    const symbol = symbols[Math.floor(Math.random() * symbols.length)]
    const type = types[Math.floor(Math.random() * types.length)]
    const price = Math.random() * 1000 + 100
    const confidence = Math.floor(Math.random() * 30) + 70

    return {
      id: Date.now().toString(),
      symbol,
      type,
      price: Number(price.toFixed(2)),
      targetPrice: Number((price * (type === "BUY" ? 1.02 : 0.98)).toFixed(2)),
      stopLoss: Number((price * (type === "BUY" ? 0.98 : 1.02)).toFixed(2)),
      confidence,
      timeframe: ["1H", "4H", "1D"][Math.floor(Math.random() * 3)],
      analysis: [
        "Strong bullish momentum with RSI oversold recovery",
        "Bearish divergence on MACD, potential correction",
        "Breaking key resistance level with high volume",
        "Support level holding, expecting bounce",
        "Trend continuation pattern confirmed",
      ][Math.floor(Math.random() * 5)],
      timestamp: new Date(),
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    }
  }, [])

  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      setIsLoading(true)
      setTimeout(() => {
        const newSignal = generateNewSignal()
        setSignals((prev) => {
          const maxSignals = isPremium ? 20 : 10
          const updated = [newSignal, ...prev].slice(0, maxSignals)
          return updated
        })
        setIsLoading(false)
      }, 1000)
    }, 8000)

    return () => clearInterval(interval)
  }, [isLive, generateNewSignal, setSignals, isPremium])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "MEDIUM":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "LOW":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "FOREX":
        return "bg-blue-500/20 text-blue-400"
      case "CRYPTO":
        return "bg-purple-500/20 text-purple-400"
      case "STOCKS":
        return "bg-emerald-500/20 text-emerald-400"
      case "COMMODITIES":
        return "bg-orange-500/20 text-orange-400"
      default:
        return "bg-gray-500/20 text-gray-400"
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-white flex items-center gap-2">
            Live Signal Feed
            {isLoading && <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />}
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className={`${isLive ? "border-emerald-500 text-emerald-400" : "border-slate-600 text-slate-400"}`}
          >
            {isLive ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
        {signals.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Waiting for signals...</p>
          </div>
        ) : (
          signals.map((signal) => (
            <Card key={signal.id} className="bg-slate-900/50 border-slate-600 animate-slide-up">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white">{signal.symbol}</h3>
                    <Badge className={getCategoryColor(signal.category)}>{signal.category}</Badge>
                    <Badge className={getPriorityColor(signal.priority)}>{signal.priority}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${signal.type === "BUY" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}
                    >
                      {signal.type === "BUY" ? (
                        <TrendingUp className="w-3 h-3 mr-1" />
                      ) : (
                        <TrendingDown className="w-3 h-3 mr-1" />
                      )}
                      {signal.type}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Entry Price</p>
                    <p className="font-semibold text-white">${signal.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      Target
                    </p>
                    <p className="font-semibold text-emerald-400">${signal.targetPrice}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      Stop Loss
                    </p>
                    <p className="font-semibold text-red-400">${signal.stopLoss}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Timeframe</p>
                    <p className="font-semibold text-white">{signal.timeframe}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">Confidence</span>
                    <span className="text-xs font-semibold text-white">{signal.confidence}%</span>
                  </div>
                  <Progress value={signal.confidence} className="h-2" />
                </div>

                <div className="mb-4">
                  <p className="text-sm text-slate-300">{signal.analysis}</p>
                </div>

                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>{signal.timestamp.toLocaleTimeString()}</span>
                  {isPremium && (
                    <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Execute Trade
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  )
}
