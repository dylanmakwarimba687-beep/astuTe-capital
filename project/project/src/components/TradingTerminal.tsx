import React, { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Zap, Target, Shield } from 'lucide-react'
import { useAppStore } from '../lib/store'
import { toast } from 'sonner'

const TradingTerminal: React.FC = () => {
  const { selectedSymbol, marketData, isDemoMode, orders, updateOrders } = useAppStore()
  const [orderType, setOrderType] = useState('market')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [stopLoss, setStopLoss] = useState('')
  const [takeProfit, setTakeProfit] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentData = marketData[selectedSymbol]

  const handlePlaceOrder = async (side: 'buy' | 'sell') => {
    if (!currentData || !quantity) {
      toast.error('Please enter a valid quantity')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        id: Date.now().toString(),
        symbol: selectedSymbol,
        qty: Number(quantity),
        side,
        type: orderType,
        price: orderType === 'market' ? currentData.price : Number(price),
        status: 'pending_new' as const,
        createdAt: new Date().toISOString(),
      }

      // Add to orders list
      updateOrders([orderData, ...orders])

      // Simulate order processing
      setTimeout(() => {
        const updatedOrders = orders.map(order => 
          order.id === orderData.id 
            ? { ...order, status: 'filled' as const, filledPrice: currentData.price }
            : order
        )
        updateOrders(updatedOrders)
        
        toast.success(`${side.toUpperCase()} order filled at $${currentData.price.toFixed(2)}`)
      }, 1500)

      toast.success('Order placed successfully')

      // Reset form
      setQuantity('')
      setPrice('')
      setStopLoss('')
      setTakeProfit('')

    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentData) {
    return (
      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6">
        <div className="text-slate-400 text-center">Loading trading terminal...</div>
      </div>
    )
  }

  return (
    <div className="bg-slate-900/50 border border-slate-700 rounded-lg">
      <div className="p-6 border-b border-slate-700">
        <h2 className="text-xl font-bold text-white">Trading Terminal - {selectedSymbol}</h2>
        {isDemoMode && (
          <p className="text-yellow-400 text-sm mt-1">Demo Mode - No real money at risk</p>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Quick Buy/Sell */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePlaceOrder('buy')}
            disabled={isSubmitting}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowUpRight className="h-5 w-5" />
            <div className="text-left">
              <div>Quick Buy</div>
              <div className="text-sm opacity-75">${currentData.ask.toFixed(2)}</div>
            </div>
          </button>
          
          <button
            onClick={() => handlePlaceOrder('sell')}
            disabled={isSubmitting}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <ArrowDownRight className="h-5 w-5" />
            <div className="text-left">
              <div>Quick Sell</div>
              <div className="text-sm opacity-75">${currentData.bid.toFixed(2)}</div>
            </div>
          </button>
        </div>

        {/* Order Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Order Type</label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
              >
                <option value="market">Market Order</option>
                <option value="limit">Limit Order</option>
                <option value="stop">Stop Order</option>
                <option value="stop_limit">Stop-Limit</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {orderType !== 'market' && (
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                placeholder={currentData.price.toFixed(2)}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Stop Loss</label>
              <input
                type="number"
                placeholder="Optional"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-2">Take Profit</label>
              <input
                type="number"
                placeholder="Optional"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {quantity && (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-white flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Order Summary
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Symbol:</span>
                <span className="text-white ml-2">{selectedSymbol}</span>
              </div>
              <div>
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white ml-2">{quantity}</span>
              </div>
              <div>
                <span className="text-slate-400">Est. Price:</span>
                <span className="text-white ml-2">
                  ${(orderType === 'market' ? currentData.price : Number(price) || currentData.price).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Est. Total:</span>
                <span className="text-emerald-400 ml-2">
                  ${((orderType === 'market' ? currentData.price : Number(price) || currentData.price) * Number(quantity)).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handlePlaceOrder('buy')}
            disabled={isSubmitting || !quantity}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Placing...' : 'Place Buy Order'}
          </button>
          
          <button
            onClick={() => handlePlaceOrder('sell')}
            disabled={isSubmitting || !quantity}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center"
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Placing...' : 'Place Sell Order'}
          </button>
        </div>

        {/* AI Signal Integration */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">AI Signal Available</span>
              <span className="bg-emerald-600 text-white text-xs px-2 py-1 rounded">BUY - 94% Confidence</span>
            </div>
            <button className="bg-transparent border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 px-4 py-2 rounded-lg text-sm transition-colors">
              Use Signal
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TradingTerminal