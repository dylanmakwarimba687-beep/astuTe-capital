import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Activity, Maximize2 } from 'lucide-react'
import { useAppStore } from '../lib/store'

interface ChartDataPoint {
  timestamp: number
  price: number
  volume: number
}

const RealTimeChart: React.FC = () => {
  const { selectedSymbol, marketData } = useAppStore()
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [timeframe, setTimeframe] = useState('1m')

  const currentData = marketData[selectedSymbol]

  useEffect(() => {
    if (currentData) {
      setChartData(prev => {
        const newData = [...prev, {
          timestamp: currentData.timestamp,
          price: currentData.price,
          volume: currentData.volume || 0,
        }]
        // Keep last 100 points
        return newData.slice(-100)
      })
    }
  }, [currentData])

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!currentData) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-400">Loading chart data...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg">
      {/* Chart Header */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold text-white">{selectedSymbol}</h2>
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${currentData ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
              <span className="text-xs text-slate-400">LIVE</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="bg-slate-800 border border-slate-600 text-white text-sm rounded px-3 py-1"
            >
              <option value="1m">1m</option>
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
              <option value="4h">4h</option>
              <option value="1d">1d</option>
            </select>
            <button className="p-2 text-slate-400 hover:text-white transition-colors">
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="flex items-center space-x-6">
          <div className="text-3xl font-bold text-white">
            ${currentData.price.toFixed(2)}
          </div>
          <div className={`flex items-center space-x-1 ${
            currentData.change >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            {currentData.change >= 0 ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            <span className="font-semibold">
              {currentData.change >= 0 ? '+' : ''}${currentData.change.toFixed(2)} ({currentData.changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={formatTime}
                stroke="#9CA3AF"
              />
              <YAxis 
                domain={['dataMin - 1', 'dataMax + 1']}
                tickFormatter={(value) => `$${value.toFixed(2)}`}
                stroke="#9CA3AF"
              />
              <Tooltip
                labelFormatter={(value) => formatTime(value as number)}
                formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke={currentData.change >= 0 ? '#10B981' : '#EF4444'}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: currentData.change >= 0 ? '#10B981' : '#EF4444' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Market Details */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-700">
          <div>
            <p className="text-slate-400 text-sm">Open</p>
            <p className="font-semibold text-white">${currentData.open.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">High</p>
            <p className="font-semibold text-emerald-400">${currentData.high.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Low</p>
            <p className="font-semibold text-red-400">${currentData.low.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Volume</p>
            <p className="font-semibold text-white">{currentData.volume?.toLocaleString() || 'N/A'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RealTimeChart