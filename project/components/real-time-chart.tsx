"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { TrendingUp, TrendingDown, Activity, Maximize2 } from "lucide-react"
import { useMarketData } from "@/hooks/useMarketData"

interface RealTimeChartProps {
  symbol: string
  height?: number
}

export default function RealTimeChart({ symbol, height = 400 }: RealTimeChartProps) {
  const { marketData, candlestickData, isConnected } = useMarketData([symbol])
  const [chartType, setChartType] = useState<"line" | "candlestick">("line")
  const [timeframe, setTimeframe] = useState("1m")
  const [priceHistory, setPriceHistory] = useState<Array<{ timestamp: number; price: number }>>([])

  const currentData = marketData[symbol]

  // Track price history for line chart
  useEffect(() => {
    if (currentData) {
      setPriceHistory((prev) => {
        const newHistory = [...prev, { timestamp: currentData.timestamp, price: currentData.price }]
        // Keep only last 100 points
        return newHistory.slice(-100)
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
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  if (!currentData) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-slate-400">Loading chart data...</div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <CardTitle className="text-white">{symbol}</CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant={isConnected ? "default" : "destructive"}>
                <Activity className="h-3 w-3 mr-1" />
                {isConnected ? "Live" : "Disconnected"}
              </Badge>
              <div className="text-2xl font-bold text-white">${formatPrice(currentData.price)}</div>
              <div
                className={`flex items-center text-sm ${currentData.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
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
          </div>
          <div className="flex items-center space-x-2">
            <Select value={chartType} onValueChange={(value: "line" | "candlestick") => setChartType(value)}>
              <SelectTrigger className="w-32 bg-slate-800 border-slate-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="candlestick">Candlestick</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-20 bg-slate-800 border-slate-600">
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
            <Button variant="ghost" size="icon">
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} stroke="#9CA3AF" />
                <YAxis domain={["dataMin - 1", "dataMax + 1"]} tickFormatter={formatPrice} stroke="#9CA3AF" />
                <Tooltip
                  labelFormatter={(value) => formatTimestamp(value as number)}
                  formatter={(value: number) => [`$${formatPrice(value)}`, "Price"]}
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "1px solid #374151",
                    borderRadius: "8px",
                    color: "#F9FAFB",
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
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-slate-400">Candlestick chart coming soon...</div>
              </div>
            )}
          </ResponsiveContainer>
        </div>

        {/* Market Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Open</p>
            <p className="font-medium text-white">${formatPrice(currentData.open)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">High</p>
            <p className="font-medium text-emerald-500">${formatPrice(currentData.high)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Low</p>
            <p className="font-medium text-red-500">${formatPrice(currentData.low)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Volume</p>
            <p className="font-medium text-white">{currentData.volume}</p>
          </div>
        </div>

        {/* Bid/Ask Spread */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-700">
          <div>
            <p className="text-sm text-slate-400">Bid</p>
            <p className="font-medium text-red-400">${formatPrice(currentData.bid)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Spread</p>
            <p className="font-medium text-slate-300">${formatPrice(currentData.spread)}</p>
          </div>
          <div>
            <p className="text-sm text-slate-400">Ask</p>
            <p className="font-medium text-emerald-400">${formatPrice(currentData.ask)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
