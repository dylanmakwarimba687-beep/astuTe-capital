import { useEffect, useRef } from 'react'
import { useAppStore } from '../lib/store'

// Free market data API (Alpha Vantage alternative)
const MARKET_DATA_API = 'https://api.twelvedata.com/price'
const API_KEY = import.meta.env.VITE_TWELVE_DATA_API_KEY || 'demo'

interface MarketDataHook {
  isConnected: boolean
  isLoading: boolean
  error: string | null
}

export const useMarketData = (): MarketDataHook => {
  const { watchlist, updateMarketData, isDemoMode } = useAppStore()
  const intervalRef = useRef<NodeJS.Timeout>()
  const isConnectedRef = useRef(false)

  useEffect(() => {
    if (isDemoMode) {
      // Demo mode - generate fake data
      generateDemoData()
      startDemoUpdates()
    } else {
      // Real mode - fetch from API
      fetchRealMarketData()
      startRealTimeUpdates()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [watchlist, isDemoMode])

  const generateDemoData = () => {
    const demoData: Record<string, any> = {}
    
    watchlist.forEach(symbol => {
      const basePrice = {
        'AAPL': 175,
        'GOOGL': 2850,
        'TSLA': 248,
        'MSFT': 380,
        'NVDA': 450,
      }[symbol] || 100

      const price = basePrice + (Math.random() - 0.5) * 10
      const change = (Math.random() - 0.5) * 5
      const changePercent = (change / price) * 100

      demoData[symbol] = {
        symbol,
        price: Number(price.toFixed(2)),
        change: Number(change.toFixed(2)),
        changePercent: Number(changePercent.toFixed(2)),
        volume: Math.floor(Math.random() * 50000000) + 1000000,
        high: Number((price + Math.random() * 5).toFixed(2)),
        low: Number((price - Math.random() * 5).toFixed(2)),
        open: Number((price + (Math.random() - 0.5) * 3).toFixed(2)),
        bid: Number((price - 0.01).toFixed(2)),
        ask: Number((price + 0.01).toFixed(2)),
        timestamp: Date.now(),
      }
    })

    updateMarketData(demoData)
    isConnectedRef.current = true
  }

  const startDemoUpdates = () => {
    intervalRef.current = setInterval(() => {
      generateDemoData()
    }, 2000) // Update every 2 seconds
  }

  const fetchRealMarketData = async () => {
    try {
      const promises = watchlist.map(async symbol => {
        const response = await fetch(
          `${MARKET_DATA_API}?symbol=${symbol}&apikey=${API_KEY}`
        )
        
        if (!response.ok) throw new Error(`Failed to fetch ${symbol}`)
        
        const data = await response.json()
        return { symbol, data }
      })

      const results = await Promise.all(promises)
      const marketData: Record<string, any> = {}

      results.forEach(({ symbol, data }) => {
        if (data.price) {
          marketData[symbol] = {
            symbol,
            price: Number(data.price),
            change: 0, // Would need additional API call for change
            changePercent: 0,
            volume: 0,
            high: 0,
            low: 0,
            open: 0,
            bid: Number(data.price) - 0.01,
            ask: Number(data.price) + 0.01,
            timestamp: Date.now(),
          }
        }
      })

      updateMarketData(marketData)
      isConnectedRef.current = true
    } catch (error) {
      console.error('Failed to fetch market data:', error)
      isConnectedRef.current = false
    }
  }

  const startRealTimeUpdates = () => {
    intervalRef.current = setInterval(() => {
      fetchRealMarketData()
    }, 10000) // Update every 10 seconds for free tier
  }

  return {
    isConnected: isConnectedRef.current,
    isLoading: false,
    error: null,
  }
}