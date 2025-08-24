"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Zap } from "lucide-react"
import { useMarketData } from "@/hooks/useMarketData"

interface TradingTerminalProps {
  symbol: string
}

export default function TradingTerminal({ symbol }: TradingTerminalProps) {
  const { marketData } = useMarketData([symbol])
  const [orderType, setOrderType] = useState("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")

  const currentData = marketData[symbol]

  const handleQuickBuy = () => {
    if (currentData) {
      setPrice(currentData.ask.toString())
      setOrderType("limit")
    }
  }

  const handleQuickSell = () => {
    if (currentData) {
      setPrice(currentData.bid.toString())
      setOrderType("limit")
    }
  }

  if (!currentData) {
    return (
      <Card className="bg-slate-900/50 border-slate-700">
        <CardContent className="p-6">
          <div className="text-slate-400 text-center">Loading trading terminal...</div>
        </CardContent>
      </Card>
    )
  }

  const formatPrice = (price: number) => {
    return symbol.includes("/") ? price.toFixed(4) : price.toFixed(2)
  }

  return (
    <Card className="bg-slate-900/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Trading Terminal - {symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700 h-12" onClick={handleQuickBuy}>
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Quick Buy
            <div className="ml-2 text-xs opacity-75">${formatPrice(currentData.ask)}</div>
          </Button>
          <Button variant="destructive" className="h-12" onClick={handleQuickSell}>
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Quick Sell
            <div className="ml-2 text-xs opacity-75">${formatPrice(currentData.bid)}</div>
          </Button>
        </div>

        {/* Order Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-slate-800 border-slate-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="market">Market Order</SelectItem>
                  <SelectItem value="limit">Limit Order</SelectItem>
                  <SelectItem value="stop">Stop Order</SelectItem>
                  <SelectItem value="stop-limit">Stop-Limit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-slate-300">Quantity</Label>
              <Input
                type="number"
                placeholder="100"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>

          {orderType !== "market" && (
            <div>
              <Label className="text-slate-300">Price</Label>
              <Input
                type="number"
                placeholder={formatPrice(currentData.price)}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300">Stop Loss</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label className="text-slate-300">Take Profit</Label>
              <Input
                type="number"
                placeholder="Optional"
                value={takeProfit}
                onChange={(e) => setTakeProfit(e.target.value)}
                className="bg-slate-800 border-slate-600 text-white"
              />
            </div>
          </div>
        </div>

        {/* Order Summary */}
        {quantity && (
          <div className="bg-slate-800/50 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-white">Order Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Symbol:</span>
                <span className="text-white ml-2">{symbol}</span>
              </div>
              <div>
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white ml-2">{quantity}</span>
              </div>
              <div>
                <span className="text-slate-400">Est. Price:</span>
                <span className="text-white ml-2">
                  ${formatPrice(orderType === "market" ? currentData.price : Number(price) || currentData.price)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Est. Total:</span>
                <span className="text-white ml-2">
                  $
                  {(
                    (orderType === "market" ? currentData.price : Number(price) || currentData.price) * Number(quantity)
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Place Buy Order
          </Button>
          <Button variant="destructive">
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Place Sell Order
          </Button>
        </div>

        {/* AI Signal Integration */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">AI Signal Available</span>
              <Badge className="bg-emerald-600">BUY - 94% Confidence</Badge>
            </div>
            <Button size="sm" variant="outline" className="bg-transparent">
              Use Signal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
