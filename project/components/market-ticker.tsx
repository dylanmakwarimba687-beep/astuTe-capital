"use client"

import { useMarketData } from "@/hooks/useMarketData"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Activity } from "lucide-react"

export default function MarketTicker() {
  const { marketData, isConnected } = useMarketData()

  const symbols = Object.keys(marketData)

  return (
    <div className="bg-slate-900/50 border-b border-slate-700 py-2">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 overflow-x-auto">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <Badge variant={isConnected ? "default" : "destructive"} className="text-xs">
              <Activity className="h-3 w-3 mr-1" />
              {isConnected ? "LIVE" : "OFFLINE"}
            </Badge>
          </div>

          {symbols.map((symbol) => {
            const data = marketData[symbol]
            if (!data) return null

            return (
              <div key={symbol} className="flex items-center space-x-2 flex-shrink-0">
                <span className="text-sm font-medium text-white">{symbol}</span>
                <span className="text-sm text-white">
                  ${symbol.includes("/") ? data.price.toFixed(4) : data.price.toFixed(2)}
                </span>
                <div className={`flex items-center text-xs ${data.change >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                  {data.change >= 0 ? (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  )}
                  {data.changePercent >= 0 ? "+" : ""}
                  {data.changePercent}%
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
