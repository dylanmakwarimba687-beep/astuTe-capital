import React, { useEffect, useState } from 'react'
import { Toaster } from 'sonner'
import { useAppStore } from './lib/store'
import { useMarketData } from './hooks/useMarketData'
import TradingDashboard from './components/TradingDashboard'
import AuthForm from './components/AuthForm'

function App() {
  const { isAuthenticated, isDemoMode } = useAppStore()
  const [showAuth, setShowAuth] = useState(!isAuthenticated && !isDemoMode)
  
  // Initialize market data
  useMarketData()

  useEffect(() => {
    setShowAuth(!isAuthenticated && !isDemoMode)
  }, [isAuthenticated, isDemoMode])

  if (showAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4">
        <AuthForm onSuccess={() => setShowAuth(false)} />
        <Toaster theme="dark" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950">
      <TradingDashboard />
      <Toaster theme="dark" />
    </div>
  )
}

export default App