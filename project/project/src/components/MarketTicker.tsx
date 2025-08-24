import React from 'react'
import { TrendingUp, TrendingDown, Activity } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { useMarketData } from '../hooks/useMarketData'

const MarketTicker: React.FC = () => {
  const { marketData } = useAppStore()
  const { isConnected } = useMarketData()

  return (
    <div className="bg-slate-900/60 border-b border-slate-700 py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-6 overflow-x-auto">
          {/* Connection Status */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
            <span className="text-xs text-slate-400">
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </span>
          </div>

          {/* Market Data */}
          {Object.values(marketData).map(data => (
            <div key={data.symbol} className="flex items-center space-x-2 flex-shrink-0">
              <span className="text-sm font-medium text-white">{data.symbol}</span>
              <span className="text-sm text-white">${data.price.toFixed(2)}</span>
              <div className={`flex items-center text-xs ${
                data.change >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {data.change >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {data.changePercent >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketTicker