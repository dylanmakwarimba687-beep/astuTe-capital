"use client"

import { useEffect } from "react"
import { useAppStore } from "@/lib/store"

// Demo user data
const DEMO_USER = {
  id: "demo-user",
  firstName: "Demo",
  lastName: "Trader",
  email: "demo@tradepro.com",
  brokers: [
    {
      name: "Demo Broker",
      accountId: "DEMO123456",
      status: "connected",
      balance: 50000.0,
    },
  ],
  preferences: {
    theme: "dark",
    notifications: true,
    charts: ["candlestick", "line"],
    currency: "USD",
  },
}

// Demo notifications
const DEMO_NOTIFICATIONS = [
  {
    id: "demo-1",
    title: "Welcome to TradePro Demo!",
    message: "Explore all features with simulated data. Your demo portfolio starts with $50,000.",
    type: "system" as const,
    priority: "high" as const,
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "demo-2",
    title: "AI Signal: AAPL Buy",
    message: "Strong bullish momentum detected. Confidence: 94%. Target: $185.00",
    type: "signal" as const,
    priority: "high" as const,
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    read: false,
  },
  {
    id: "demo-3",
    title: "Demo Trade Executed",
    message: "Successfully bought 100 shares of TSLA at $248.50 (Demo Mode)",
    type: "trade" as const,
    priority: "medium" as const,
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: true,
  },
  {
    id: "demo-4",
    title: "Market Alert: Fed Decision",
    message: "Federal Reserve announces interest rate decision at 2:00 PM EST",
    type: "news" as const,
    priority: "high" as const,
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    read: true,
  },
]

// Demo portfolio data
const DEMO_PORTFOLIO = {
  totalValue: 52847.32,
  totalCost: 50000.0,
  totalPnL: 2847.32,
  totalPnLPercent: 5.69,
  dayChange: 1247.85,
  dayChangePercent: 2.42,
  cash: 15837.9,
}

// Demo positions
const DEMO_POSITIONS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    quantity: 100,
    avgPrice: 165.5,
    currentPrice: 175.43,
    value: 17543.0,
    pnl: 993.0,
    pnlPercent: 6.0,
    allocation: 33.2,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    quantity: 50,
    avgPrice: 235.8,
    currentPrice: 248.5,
    value: 12425.0,
    pnl: 635.0,
    pnlPercent: 5.38,
    allocation: 23.5,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    quantity: 30,
    avgPrice: 370.25,
    currentPrice: 378.85,
    value: 11365.5,
    pnl: 258.0,
    pnlPercent: 2.32,
    allocation: 21.5,
  },
]

// Demo orders
const DEMO_ORDERS = [
  {
    id: "demo-order-1",
    symbol: "AAPL",
    type: "BUY",
    quantity: 100,
    price: 175.5,
    status: "FILLED",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-order-2",
    symbol: "GOOGL",
    type: "BUY",
    quantity: 5,
    price: 2850.0,
    status: "PENDING",
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-order-3",
    symbol: "TSLA",
    type: "SELL",
    quantity: 25,
    price: 250.0,
    status: "CANCELLED",
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
]

export default function DemoDataGenerator() {
  const {
    isDemoMode,
    setUser,
    setAuthenticated,
    setPremium,
    updatePortfolio,
    updatePositions,
    updateOrders,
    notifications,
    addNotification,
  } = useAppStore()

  useEffect(() => {
    if (isDemoMode) {
      // Set demo user
      setUser(DEMO_USER)
      setAuthenticated(true)
      setPremium(true) // Give demo users premium access

      // Set demo portfolio data
      updatePortfolio(DEMO_PORTFOLIO)
      updatePositions(DEMO_POSITIONS)
      updateOrders(DEMO_ORDERS)

      // Add demo notifications if not already present
      const hasWelcomeNotification = notifications.some((n) => n.id === "demo-1")
      if (!hasWelcomeNotification) {
        DEMO_NOTIFICATIONS.forEach((notification) => {
          addNotification(notification)
        })
      }
    }
  }, [
    isDemoMode,
    setUser,
    setAuthenticated,
    setPremium,
    updatePortfolio,
    updatePositions,
    updateOrders,
    notifications,
    addNotification,
  ])

  return null // This component doesn't render anything
}
