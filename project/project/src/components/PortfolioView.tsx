import React from 'react'
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Target } from 'lucide-react'
import { useAppStore } from '../lib/store'

const PortfolioView: React.FC = () => {
  const { positions, portfolioValue, cashBalance } = useAppStore()

  // Mock positions for demo
  const mockPositions = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      qty: 100,
      avgCost: 165.5,
      currentPrice: 175.43,
      marketValue: 17543.0,
      unrealizedPL: 993.0,
      unrealizedPLPercent: 6.0,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      qty: 5,
      avgCost: 2900.0,
      currentPrice: 2847.92,
      marketValue: 14239.6,
      unrealizedPL: -260.4,
      unrealizedPLPercent: -1.8,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      qty: 50,
      avgCost: 235.8,
      currentPrice: 248.5,
      marketValue: 12425.0,
      unrealizedPL: 635.0,
      unrealizedPLPercent: 5.38,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      qty: 30,
      avgCost: 370.25,
      currentPrice: 378.85,
      marketValue: 11365.5,
      unrealizedPL: 258.0,
      unrealizedPLPercent: 2.32,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      qty: 25,
      avgCost: 420.0,
      currentPrice: 456.78,
      marketValue: 11419.5,
      unrealizedPL: 919.5,
      unrealizedPLPercent: 8.75,
    },
  ]

  const totalValue = mockPositions.reduce((sum, pos) => sum + pos.marketValue, 0) + cashBalance
  const totalPL = mockPositions.reduce((sum, pos) => sum + pos.unrealizedPL, 0)
  const totalPLPercent = (totalPL / (totalValue - totalPL)) * 100

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Total Value</h3>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-white">${totalValue.toLocaleString()}</div>
          <p className="text-xs text-emerald-500 flex items-center mt-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            +{totalPLPercent.toFixed(2)}% total return
          </p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Day P&L</h3>
            <Activity className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">+$1,247</div>
          <p className="text-xs text-emerald-500">+1.82% today</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Total P&L</h3>
            <Target className="h-4 w-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-emerald-500">+${totalPL.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Unrealized gains</p>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-slate-400 text-sm font-medium">Cash</h3>
            <PieChart className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-white">${cashBalance.toLocaleString()}</div>
          <p className="text-xs text-slate-400">Available for trading</p>
        </div>
      </div>

      {/* Positions */}
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg">
        <div className="p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white">Current Positions</h2>
          <p className="text-slate-400 text-sm mt-1">Your active holdings and performance</p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {mockPositions.map((position) => (
              <div key={position.symbol} className="border border-slate-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-white">{position.symbol}</h3>
                    <p className="text-sm text-slate-400">{position.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${position.marketValue.toLocaleString()}</p>
                    <p className="text-sm text-slate-400">Market Value</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Quantity</p>
                    <p className="font-medium text-white">{position.qty}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Avg Cost</p>
                    <p className="font-medium text-white">${position.avgCost.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Current Price</p>
                    <p className="font-medium text-white">${position.currentPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">P&L</p>
                    <p className={`font-medium flex items-center ${
                      position.unrealizedPL >= 0 ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {position.unrealizedPL >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      ${Math.abs(position.unrealizedPL).toFixed(2)} ({position.unrealizedPLPercent >= 0 ? '+' : ''}{position.unrealizedPLPercent.toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioView