"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Activity, RotateCcw } from "lucide-react"
import { useMarketData } from "@/hooks/useMarketData"

interface MobileOptimizedChartProps {
  symbol: string
  height?: number
  compact?: boolean
}

export default function MobileOptimizedChart({ symbol, height = 300, compact = false }: MobileOptimizedChartProps) {
  const { marketData, candlestickData, isConnected } = useMarketData([symbol])
  const [chartType, setChartType] = useState<"line" | "candlestick">("line")
  const [timeframe, setTimeframe] = useState("1m")
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: number; price: number }>>([])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const currentData = marketData[symbol]

  // Track price history for line chart
  useEffect(() => {
    if (currentData) {
      setPriceHistory((prev) => {
        const newHistory = [...prev, { timestamp: currentData.timestamp, price: currentData.price }]
        return newHistory.slice(-50) // Keep fewer points on mobile
      })
    }
  }, [currentData])

  const formatPrice = (price: number) => {
    if (symbol.includes("/")) {
      return price.toFixed(4)
    }
    return price.toFixed(2)
  }

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
  }

  if (!currentData) {
    return (
      <Card className="trading-card">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-center h-48 sm:h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-slate-400 animate-pulse" />
              <div className="text-slate-400">Loading chart data...</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartHeight = compact ? 200 : height

  return (
    <Card className="trading-card">
      <CardHeader className="pb-2 sm:pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <CardTitle className="text-lg sm:text-xl text-white">{symbol}</CardTitle>
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {isConnected ? "Live" : "Offline"}
            </Badge>
          </div>

          {!compact && (
            <div className="flex items-center space-x-2 overflow-x-auto">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-16 sm:w-20 bg-slate-800 border-slate-600 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1m</SelectItem>
                  <SelectItem value="5m">5m</SelectItem>
                  <SelectItem value="15m">15m</SelectItem>
                  <SelectItem value="1h">1h</SelectItem>
                  <SelectItem value="4h">4h</SelectItem>
                  <SelectItem value="1d">1d</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" className="mobile-friendly-button">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Price Display */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          <div className="text-2xl sm:text-3xl font-bold text-white">${formatPrice(currentData.price)}</div>
          <div
            className={`flex items-center text-sm sm:text-base ${
              currentData.change >= 0 ? "text-emerald-500" : "text-red-500"
            }`}
          >
            {currentData.change >= 0 ? (
              <TrendingUp className="h-4 w-4 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 mr-1" />
            )}
            {currentData.change >= 0 ? "+" : ""}
            {formatPrice(currentData.change)} ({currentData.changePercent}%)
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-2 sm:p-6">
        <div style={{ height: chartHeight }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceHistory} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTimestamp}
                stroke="#9CA3AF"
                fontSize={12}
                interval="preserveStartEnd"
              />
              <YAxis
                domain={["dataMin - 1", "dataMax + 1"]}
                tickFormatter={formatPrice}
                stroke="#9CA3AF"
                fontSize={12}
                width={60}
              />
              <Tooltip
                labelFormatter={(value) => formatTimestamp(value as number)}
                formatter={(value: number) => [`$${formatPrice(value)}`, "Price"]}
                contentStyle={{
                  backgroundColor: "#1F2937",
                  border: "1px solid #374151",
                  borderRadius: "8px",
                  color: "#F9FAFB",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={currentData.change >= 0 ? "#10B981" : "#EF4444"}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: currentData.change >= 0 ? "#10B981" : "#EF4444" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Details - Mobile Optimized */}
        {!compact && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 pt-4 border-t border-slate-700">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Open</p>
                <p className="font-medium text-white text-sm sm:text-base">${formatPrice(currentData.open)}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">High</p>
                <p className="font-medium text-emerald-500 text-sm sm:text-base">${formatPrice(currentData.high)}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Low</p>
                <p className="font-medium text-red-500 text-sm sm:text-base">${formatPrice(currentData.low)}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Volume</p>
                <p className="font-medium text-white text-sm sm:text-base">{currentData.volume}</p>
              </div>
            </div>

            {/* Bid/Ask Spread - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-slate-700">
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Bid</p>
                <p className="font-medium text-red-400 text-sm sm:text-base">${formatPrice(currentData.bid)}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Spread</p>
                <p className="font-medium text-slate-300 text-sm sm:text-base">${formatPrice(currentData.spread)}</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-xs sm:text-sm text-slate-400">Ask</p>
                <p className="font-medium text-emerald-400 text-sm sm:text-base">${formatPrice(currentData.ask)}</p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
