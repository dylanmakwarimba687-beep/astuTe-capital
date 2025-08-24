"use client"

import { useEffect, useState } from "react"
import { useAppStore } from "@/lib/store"

interface MarketDataPoint {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: string
  high: number
  low: number
  open: number
  timestamp: number
  bid: number
  ask: number
  spread: number
}

export function useMarketData() {
  const { isDemoMode, updateMarketData, marketData } = useAppStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode) {
      // Generate demo market data
      const demoData: Record<string, MarketDataPoint> = {
        AAPL: {
          symbol: "AAPL",
          price: 175.43,
          change: 2.15,
          changePercent: 1.24,
          volume: "45.2M",
          high: 177.25,
          low: 173.8,
          open: 174.2,
          timestamp: Date.now(),
          bid: 175.42,
          ask: 175.44,
          spread: 0.02,
        },
        GOOGL: {
          symbol: "GOOGL",
          price: 2847.32,
          change: -12.45,
          changePercent: -0.44,
          volume: "1.2M",
          high: 2865.0,
          low: 2840.15,
          open: 2859.77,
          timestamp: Date.now(),
          bid: 2847.3,
          ask: 2847.34,
          spread: 0.04,
        },
        TSLA: {
          symbol: "TSLA",
          price: 248.67,
          change: 5.23,
          changePercent: 2.15,
          volume: "28.7M",
          high: 251.45,
          low: 243.2,
          open: 243.44,
          timestamp: Date.now(),
          bid: 248.65,
          ask: 248.69,
          spread: 0.04,
        },
        MSFT: {
          symbol: "MSFT",
          price: 378.92,
          change: 1.87,
          changePercent: 0.5,
          volume: "22.1M",
          high: 380.25,
          low: 376.8,
          open: 377.05,
          timestamp: Date.now(),
          bid: 378.9,
          ask: 378.94,
          spread: 0.04,
        },
        NVDA: {
          symbol: "NVDA",
          price: 445.78,
          change: 8.92,
          changePercent: 2.04,
          volume: "35.6M",
          high: 448.5,
          low: 436.86,
          open: 436.86,
          timestamp: Date.now(),
          bid: 445.76,
          ask: 445.8,
          spread: 0.04,
        },
      }

      updateMarketData(demoData)
      setIsLoading(false)

      // Simulate real-time updates
      const interval = setInterval(() => {
        const updatedData: Record<string, MarketDataPoint> = {}
        Object.keys(demoData).forEach((symbol) => {
          const current = demoData[symbol]
          const priceChange = (Math.random() - 0.5) * 2
          const newPrice = Math.max(0.01, current.price + priceChange)
          const change = newPrice - current.open
          const changePercent = (change / current.open) * 100

          updatedData[symbol] = {
            ...current,
            price: newPrice,
            change,
            changePercent,
            timestamp: Date.now(),
            bid: newPrice - 0.02,
            ask: newPrice + 0.02,
          }
        })
        updateMarketData(updatedData)
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [isDemoMode, updateMarketData])

  return {
    marketData,
    isLoading,
  }
}
