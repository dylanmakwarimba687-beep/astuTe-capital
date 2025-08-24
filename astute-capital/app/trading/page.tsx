"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown } from "lucide-react"
import MobileOptimizedChart from "@/components/mobile-optimized-chart"
import MarketDepth from "@/components/market-depth"
import MobileTradingTerminal from "@/components/mobile-trading-terminal"
import { useMarketData } from "@/hooks/useMarketData"
import { useAppStore } from "@/lib/store"

export default function TradingInterface() {
  const { selectedSymbol, setSelectedSymbol } = useAppStore()
  const { marketData, isConnected } = useMarketData()

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Real-time Market Data Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        {/* Main Chart */}
        <div className="xl:col-span-2">
          <MobileOptimizedChart symbol={selectedSymbol} height={400} />
        </div>

        {/* Market Depth - Hidden on mobile, shown on larger screens */}
        <div className="hidden lg:block">
          <MarketDepth symbol={selectedSymbol} />
        </div>
      </div>

      {/* Trading Terminal and Watchlist - Mobile Optimized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <MobileTradingTerminal symbol={selectedSymbol} />

        {/* Enhanced Watchlist with real-time data */}
        <Card className="trading-card">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-lg sm:text-xl text-white">
              Live Watchlist
              <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
                {isConnected ? "Connected" : "Disconnected"}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 sm:space-y-3">
              {Object.entries(marketData).map(([symbol, data]) => (
                <div
                  key={symbol}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors mobile-tap ${
                    selectedSymbol === symbol
                      ? "border-emerald-500 bg-emerald-500/10"
                      : "border-slate-700 hover:border-slate-600"
                  }`}
                  onClick={() => setSelectedSymbol(symbol)}
                >
                  <div>
                    <p className="font-medium text-white text-sm sm:text-base">{symbol}</p>
                    <p className="text-xs sm:text-sm text-slate-400">
                      ${symbol.includes("/") ? data.price.toFixed(4) : data.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm flex items-center ${data.change >= 0 ? "text-emerald-500" : "text-red-500"}`}
                    >
                      {data.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {data.changePercent >= 0 ? "+" : ""}
                      {data.changePercent}%
                    </div>
                    <div className="text-xs text-slate-400">Vol: {data.volume}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Market Depth - Only shown on mobile */}
      <div className="lg:hidden">
        <MarketDepth symbol={selectedSymbol} />
      </div>
    </div>
  )
}
