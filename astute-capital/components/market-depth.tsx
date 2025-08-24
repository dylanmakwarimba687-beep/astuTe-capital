"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useMarketData } from "@/hooks/useMarketData"

interface OrderBookEntry {
  price: number
  size: number
  total: number
}

interface MarketDepthProps {
  symbol: string
}

export default function MarketDepth({ symbol }: MarketDepthProps) {
  const { marketData } = useMarketData([symbol])
  const [bids, setBids] = useState<OrderBookEntry[]>([])
  const [asks, setAsks] = useState<OrderBookEntry[]>([])

  const currentData = marketData[symbol]

  // Generate mock order book data
  useEffect(() => {
    if (!currentData) return

    const generateOrderBook = () => {
      const midPrice = currentData.price
      const spread = currentData.spread

      // Generate bids (below current price)
      const newBids: OrderBookEntry[] = []
      let totalBidSize = 0
      for (let i = 0; i < 10; i++) {
        const price = midPrice - spread / 2 - i * spread * 0.1
        const size = Math.random() * 1000 + 100
        totalBidSize += size
        newBids.push({
          price: Number(price.toFixed(symbol.includes("/") ? 4 : 2)),
          size: Math.round(size),
          total: Math.round(totalBidSize),
        })
      }

      // Generate asks (above current price)
      const newAsks: OrderBookEntry[] = []
      let totalAskSize = 0
      for (let i = 0; i < 10; i++) {
        const price = midPrice + spread / 2 + i * spread * 0.1
        const size = Math.random() * 1000 + 100
        totalAskSize += size
        newAsks.push({
          price: Number(price.toFixed(symbol.includes("/") ? 4 : 2)),
          size: Math.round(size),
          total: Math.round(totalAskSize),
        })
      }

      setBids(newBids)
      setAsks(newAsks.reverse()) // Reverse asks to show lowest price first
    }

    generateOrderBook()
    const interval = setInterval(generateOrderBook, 2000) // Update every 2 seconds

    return () => clearInterval(interval)
  }, [currentData, symbol])

  if (!currentData) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-slate-400 text-center">Loading market depth...</div>
        </CardContent>
      </Card>
    )
  }

  const maxBidTotal = Math.max(...bids.map((b) => b.total))
  const maxAskTotal = Math.max(...asks.map((a) => a.total))
  const maxTotal = Math.max(maxBidTotal, maxAskTotal)

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Market Depth - {symbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 text-sm text-slate-400 font-medium">
            <div>Price</div>
            <div className="text-right">Size</div>
            <div className="text-right">Total</div>
          </div>

          {/* Asks (Sell Orders) */}
          <div className="space-y-1">
            {asks.map((ask, index) => (
              <div key={`ask-${index}`} className="relative">
                <div
                  className="absolute inset-0 bg-red-500/10 rounded"
                  style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                />
                <div className="relative grid grid-cols-3 gap-4 text-sm py-1 px-2">
                  <div className="text-red-400 font-mono">
                    {symbol.includes("/") ? ask.price.toFixed(4) : ask.price.toFixed(2)}
                  </div>
                  <div className="text-right text-white font-mono">{ask.size.toLocaleString()}</div>
                  <div className="text-right text-slate-300 font-mono">{ask.total.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current Price */}
          <div className="border-t border-b border-slate-600 py-2">
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                ${symbol.includes("/") ? currentData.price.toFixed(4) : currentData.price.toFixed(2)}
              </div>
              <div className="text-xs text-slate-400">Current Price</div>
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div className="space-y-1">
            {bids.map((bid, index) => (
              <div key={`bid-${index}`} className="relative">
                <div
                  className="absolute inset-0 bg-emerald-500/10 rounded"
                  style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                />
                <div className="relative grid grid-cols-3 gap-4 text-sm py-1 px-2">
                  <div className="text-emerald-400 font-mono">
                    {symbol.includes("/") ? bid.price.toFixed(4) : bid.price.toFixed(2)}
                  </div>
                  <div className="text-right text-white font-mono">{bid.size.toLocaleString()}</div>
                  <div className="text-right text-slate-300 font-mono">{bid.total.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
