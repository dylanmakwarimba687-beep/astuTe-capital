import React, { useState } from 'react'
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Activity,
  Bell,
  Settings,
  User,
  Menu,
  Crown,
  Zap,
  Target,
  Wallet,
  Eye,
  EyeOff
} from 'lucide-react'
import { useAppStore } from '../lib/store'
import MarketTicker from './MarketTicker'
import RealTimeChart from './RealTimeChart'
import TradingTerminal from './TradingTerminal'
import PortfolioView from './PortfolioView'
import SignalsFeed from './SignalsFeed'
import NotificationsPanel from './NotificationsPanel'

const TradingDashboard: React.FC = () => {
  const {
    user,
    activeTab,
    setActiveTab,
    showNotifications,
    setShowNotifications,
    showSettings,
    setShowSettings,
    showProfile,
    setShowProfile,
    isDemoMode,
    portfolioValue,
    cashBalance,
  } = useAppStore()

  const [balanceVisible, setBalanceVisible] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'trading', label: 'Trading', icon: Activity },
    { id: 'signals', label: 'Signals', icon: Zap },
    { id: 'portfolio', label: 'Portfolio', icon: Wallet },
    { id: 'analysis', label: 'Analysis', icon: Target },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />
      case 'trading':
        return <TradingContent />
      case 'signals':
        return <SignalsFeed />
      case 'portfolio':
        return <PortfolioView />
      case 'analysis':
        return <AnalysisContent />
      default:
        return <DashboardContent />
    }
  }

  const DashboardContent = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <RealTimeChart />
      </div>
      <div className="space-y-6">
        <PortfolioSummary />
        <QuickActions />
      </div>
    </div>
  )

  const TradingContent = () => (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <RealTimeChart />
      <TradingTerminal />
    </div>
  )

  const AnalysisContent = () => (
    <div className="grid grid-cols-1 gap-6">
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <h3 className="text-white text-lg font-semibold mb-4">Market Analysis</h3>
        <p className="text-slate-400">Advanced market analysis tools coming soon...</p>
      </div>
    </div>
  )

  const PortfolioSummary = () => (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Portfolio Summary</h3>
        <button
          onClick={() => setBalanceVisible(!balanceVisible)}
          className="text-slate-400 hover:text-white transition-colors"
        >
          {balanceVisible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
        </button>
      </div>
      
      <div className="space-y-4">
        <div>
          <p className="text-slate-400 text-sm">Total Value</p>
          <p className="text-2xl font-bold text-white">
            {balanceVisible ? `$${portfolioValue.toLocaleString()}` : '••••••'}
          </p>
        </div>
        
        <div>
          <p className="text-slate-400 text-sm">Cash Balance</p>
          <p className="text-lg font-semibold text-emerald-400">
            {balanceVisible ? `$${cashBalance.toLocaleString()}` : '••••••'}
          </p>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-700">
          <span className="text-slate-400 text-sm">Day P&L</span>
          <span className="text-emerald-400 font-semibold">+$2,840 (+2.31%)</span>
        </div>
      </div>
    </div>
  )

  const QuickActions = () => (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
      <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          Place Buy Order
        </button>
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <TrendingDown className="h-4 w-4 mr-2" />
          Place Sell Order
        </button>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center">
          <Zap className="h-4 w-4 mr-2" />
          View Signals
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-blue-600/20 border-b border-blue-500/30 p-3 text-center">
          <p className="text-blue-300 text-sm">
            <span className="font-semibold">Demo Mode Active</span> - Practice trading with virtual funds
          </p>
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">TradePro</h1>
                <p className="text-xs text-slate-400 hidden sm:block">Professional Trading Platform</p>
              </div>
            </div>

            {/* Navigation - Desktop */}
            <nav className="hidden md:flex items-center space-x-1">
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-emerald-600 text-white'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {/* Premium Badge */}
              <div className="hidden sm:flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-white font-semibold">
                    {balanceVisible ? `$${portfolioValue.toLocaleString()}` : '••••••'}
                  </p>
                  <p className="text-xs text-slate-400">Portfolio Value</p>
                </div>
                {user && (
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-2 rounded-lg">
                    <Crown className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>

              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>

              {/* Profile */}
              <button
                onClick={() => setShowProfile(true)}
                className="p-2 text-slate-400 hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Market Ticker */}
      <MarketTicker />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 p-4">
        <div className="flex justify-around">
          {tabs.slice(0, 4).map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'text-emerald-400'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      {/* Panels */}
      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </div>
  )
}

export default TradingDashboard