import React, { useState, useEffect } from 'react'
import { Zap, TrendingUp, TrendingDown, Target, Shield, Clock, CheckCircle } from 'lucide-react'
import { useAppStore } from '../lib/store'

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

const SignalsFeed: React.FC = () => {
  const { signals, addSignal } = useAppStore()
  const [filter, setFilter] = useState('all')

  // Generate demo signals
  useEffect(() => {
    const generateSignal = () => {
      const symbols = ['AAPL', 'GOOGL', 'TSLA', 'MSFT', 'NVDA']
      const types: ('BUY' | 'SELL')[] = ['BUY', 'SELL']
      const reasons = [
        'Strong bullish momentum detected',
        'Bearish divergence on RSI',
        'Breaking key resistance level',
        'Support level bounce expected',
        'Earnings momentum continuation'
      ]

      const symbol = symbols[Math.floor(Math.random() * symbols.length)]
      const type = types[Math.floor(Math.random() * types.length)]
      const basePrice = Math.random() * 500 + 100
      
      const newSignal: Signal = {
        id: Date.now().toString(),
        symbol,
        type,
        confidence: Math.floor(Math.random() * 25) + 75, // 75-100%
        targetPrice: type === 'BUY' ? basePrice * 1.05 : basePrice * 0.95,
        stopLoss: type === 'BUY' ? basePrice * 0.95 : basePrice * 1.05,
        reason: reasons[Math.floor(Math.random() * reasons.length)],
        timestamp: new Date().toISOString(),
        status: 'active',
      }

      addSignal(newSignal)
    }

    // Generate initial signals
    if (signals.length === 0) {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => generateSignal(), i * 1000)
      }
    }

    // Generate new signals periodically
    const interval = setInterval(generateSignal, 15000)
    return () => clearInterval(interval)
  }, [signals.length, addSignal])

  const filteredSignals = signals.filter(signal => {
    if (filter === 'all') return true
    if (filter === 'buy') return signal.type === 'BUY'
    if (filter === 'sell') return signal.type === 'SELL'
    return signal.status === filter
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Trading Signals</h1>
          <p className="text-slate-400 mt-1">Real-time AI-powered trading recommendations</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2 text-sm"
          >
            <option value="all">All Signals</option>
            <option value="buy">Buy Signals</option>
            <option value="sell">Sell Signals</option>
            <option value="active">Active Only</option>
          </select>
        </div>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Zap className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-slate-400 text-sm">Active Signals</p>
              <p className="text-xl font-bold text-white">{signals.filter(s => s.status === 'active').length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <div>
              <p className="text-slate-400 text-sm">Accuracy Rate</p>
              <p className="text-xl font-bold text-white">89%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-emerald-500" />
            <div>
              <p className="text-slate-400 text-sm">Avg Return</p>
              <p className="text-xl font-bold text-white">+3.7%</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-yellow-500" />
            <div>
              <p className="text-slate-400 text-sm">Win Rate</p>
              <p className="text-xl font-bold text-white">78%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signals List */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Latest Signals</h2>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {filteredSignals.length === 0 ? (
              <div className="text-center py-8">
                <Zap className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No signals available</p>
                <p className="text-slate-500 text-sm">New signals will appear here</p>
              </div>
            ) : (
              filteredSignals.map(signal => (
                <div key={signal.id} className="border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-bold text-lg text-white">{signal.symbol}</h3>
                      <span className={`px-3 py-1 rounded-lg text-sm font-medium flex items-center ${
                        signal.type === 'BUY' 
                          ? 'bg-emerald-600/20 text-emerald-400' 
                          : 'bg-red-600/20 text-red-400'
                      }`}>
                        {signal.type === 'BUY' ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {signal.type}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        signal.status === 'active' ? 'bg-blue-600 text-white' :
                        signal.status === 'triggered' ? 'bg-green-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {signal.status}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-slate-400 text-sm">Confidence</p>
                      <p className="font-bold text-white">{signal.confidence}%</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-slate-400 text-xs">Target Price</p>
                      <p className="font-semibold text-emerald-400 flex items-center">
                        <Target className="h-3 w-3 mr-1" />
                        ${signal.targetPrice.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Stop Loss</p>
                      <p className="font-semibold text-red-400 flex items-center">
                        <Shield className="h-3 w-3 mr-1" />
                        ${signal.stopLoss.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs">Risk/Reward</p>
                      <p className="font-semibold text-white">1:2.5</p>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm mb-3">{signal.reason}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-slate-500">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(signal.timestamp).toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Execute Trade
                      </button>
                      <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                        Save Signal
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignalsFeed