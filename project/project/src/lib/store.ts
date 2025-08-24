import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
  emailVerified: boolean
  brokerConnected: boolean
  accountType: 'demo' | 'live'
}

interface Position {
  symbol: string
  qty: number
  avgCost: number
  currentPrice: number
  marketValue: number
  unrealizedPL: number
  unrealizedPLPercent: number
}

interface Order {
  id: string
  symbol: string
  qty: number
  side: 'buy' | 'sell'
  type: 'market' | 'limit' | 'stop' | 'stop_limit'
  status: 'new' | 'filled' | 'cancelled' | 'pending_new'
  price?: number
  filledPrice?: number
  createdAt: string
}

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  bid: number
  ask: number
  timestamp: number
}

interface Signal {
  id: string
  symbol: string
  type: 'BUY' | 'SELL'
  confidence: number
  targetPrice: number
  stopLoss: number
  reason: string
  timestamp: string
  status: 'active' | 'triggered' | 'expired'
}

interface AppState {
  // User state
  user: User | null
  isAuthenticated: boolean
  
  // Market data
  marketData: Record<string, MarketData>
  selectedSymbol: string
  watchlist: string[]
  
  // Trading
  positions: Position[]
  orders: Order[]
  portfolioValue: number
  cashBalance: number
  
  // Signals
  signals: Signal[]
  
  // UI state
  activeTab: string
  showNotifications: boolean
  showSettings: boolean
  showProfile: boolean
  isDemoMode: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setAuthenticated: (auth: boolean) => void
  updateMarketData: (data: Record<string, MarketData>) => void
  setSelectedSymbol: (symbol: string) => void
  addToWatchlist: (symbol: string) => void
  removeFromWatchlist: (symbol: string) => void
  updatePositions: (positions: Position[]) => void
  updateOrders: (orders: Order[]) => void
  addSignal: (signal: Signal) => void
  setActiveTab: (tab: string) => void
  setShowNotifications: (show: boolean) => void
  setShowSettings: (show: boolean) => void
  setShowProfile: (show: boolean) => void
  setDemoMode: (demo: boolean) => void
  logout: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      marketData: {},
      selectedSymbol: 'AAPL',
      watchlist: ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA'],
      positions: [],
      orders: [],
      portfolioValue: 0,
      cashBalance: 100000, // Start with $100k in demo
      signals: [],
      activeTab: 'dashboard',
      showNotifications: false,
      showSettings: false,
      showProfile: false,
      isDemoMode: true,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      
      setAuthenticated: (auth) => set({ isAuthenticated: auth }),
      
      updateMarketData: (data) => {
        const current = get().marketData
        set({ marketData: { ...current, ...data } })
      },
      
      setSelectedSymbol: (symbol) => set({ selectedSymbol: symbol }),
      
      addToWatchlist: (symbol) => {
        const watchlist = get().watchlist
        if (!watchlist.includes(symbol)) {
          set({ watchlist: [...watchlist, symbol] })
        }
      },
      
      removeFromWatchlist: (symbol) => {
        const watchlist = get().watchlist
        set({ watchlist: watchlist.filter(s => s !== symbol) })
      },
      
      updatePositions: (positions) => set({ positions }),
      
      updateOrders: (orders) => set({ orders }),
      
      addSignal: (signal) => {
        const signals = get().signals
        set({ signals: [signal, ...signals.slice(0, 49)] }) // Keep last 50
      },
      
      setActiveTab: (tab) => set({ activeTab: tab }),
      
      setShowNotifications: (show) => set({ showNotifications: show }),
      
      setShowSettings: (show) => set({ showSettings: show }),
      
      setShowProfile: (show) => set({ showProfile: show }),
      
      setDemoMode: (demo) => set({ isDemoMode: demo }),
      
      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          positions: [],
          orders: [],
          portfolioValue: 0,
          signals: [],
        })
        localStorage.removeItem('trading-store')
      },
    }),
    {
      name: 'trading-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        selectedSymbol: state.selectedSymbol,
        watchlist: state.watchlist,
        activeTab: state.activeTab,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
)