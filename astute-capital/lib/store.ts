"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  brokers: any[]
  preferences: any
  role?: "admin" | "user"
}

interface MarketData {
  [symbol: string]: {
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
}

interface Notification {
  id: string
  title: string
  message: string
  type: "signal" | "trade" | "news" | "system"
  priority: "high" | "medium" | "low"
  timestamp: string
  read: boolean
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean

  // Demo mode state
  isDemoMode: boolean
  showDemoTour: boolean

  // Market data state
  marketData: MarketData
  isMarketConnected: boolean
  selectedSymbol: string
  watchlist: string[]

  // UI state
  activeTab: string
  isPremium: boolean
  showNotifications: boolean
  showSettings: boolean
  showProfile: boolean

  // Notifications
  notifications: Notification[]
  unreadCount: number

  // Trading state
  orders: any[]
  positions: any[]
  portfolio: any

  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (authenticated: boolean) => void
  setDemoMode: (demo: boolean) => void
  setShowDemoTour: (show: boolean) => void
  updateMarketData: (data: MarketData) => void
  setMarketConnected: (connected: boolean) => void
  setSelectedSymbol: (symbol: string) => void
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  setActiveTab: (tab: string) => void
  setPremium: (premium: boolean) => void
  setShowNotifications: (show: boolean) => void
  setShowSettings: (show: boolean) => void
  setShowProfile: (show: boolean) => void
  addNotification: (notification: Omit<Notification, "id"> | Notification) => void
  markNotificationRead: (id: string) => void
  clearAllNotifications: () => void
  updateOrders: (orders: any[]) => void
  updatePositions: (positions: any[]) => void
  updatePortfolio: (portfolio: any) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      isDemoMode: false,
      showDemoTour: false,
      marketData: {},
      isMarketConnected: false,
      selectedSymbol: "AAPL",
      watchlist: ["AAPL", "GOOGL", "TSLA", "MSFT", "NVDA"],
      activeTab: "dashboard",
      isPremium: false,
      showNotifications: false,
      showSettings: false,
      showProfile: false,
      notifications: [],
      unreadCount: 0,
      orders: [],
      positions: [],
      portfolio: null,

      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),

      setDemoMode: (demo) => set({ isDemoMode: demo }),

      setShowDemoTour: (show) => set({ showDemoTour: show }),

      updateMarketData: (data) => set({ marketData: { ...get().marketData, ...data } }),

      setMarketConnected: (connected) => set({ isMarketConnected: connected }),

      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),

      addToWatchlist: (symbol) => {
        const { watchlist } = get()
        if (!watchlist.includes(symbol)) {
          set({ watchlist: [...watchlist, symbol] })
        }
      },

      removeFromWatchlist: (symbol) => {
        const { watchlist } = get()
        set({ watchlist: watchlist.filter((s) => s !== symbol) })
      },

      setActiveTab: (tab) => set({ activeTab: tab }),

      setPremium: (premium) => set({ isPremium: premium }),

      setShowNotifications: (show) => set({ showNotifications: show }),

      setShowSettings: (show) => set({ showSettings: show }),

      setShowProfile: (show) => set({ showProfile: show }),

      addNotification: (notification) => {
        const newNotification = {
          ...notification,
          id: "id" in notification ? notification.id : Date.now().toString(),
        }
        const { notifications } = get()
        set({
          notifications: [newNotification, ...notifications],
          unreadCount: get().unreadCount + (newNotification.read ? 0 : 1),
        })
      },

      markNotificationRead: (id) => {
        const { notifications } = get()
        const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
        const unreadCount = updated.filter((n) => !n.read).length
        set({ notifications: updated, unreadCount })
      },

      clearAllNotifications: () => set({ notifications: [], unreadCount: 0 }),

      updateOrders: (orders) => set({ orders }),

      updatePositions: (positions) => set({ positions }),

      updatePortfolio: (portfolio) => set({ portfolio }),
    }),
    {
      name: "tradepro-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        isDemoMode: state.isDemoMode,
        selectedSymbol: state.selectedSymbol,
        watchlist: state.watchlist,
        activeTab: state.activeTab,
        isPremium: state.isPremium,
      }),
    },
  ),
)
