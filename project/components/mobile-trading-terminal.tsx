"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowUpRight, ArrowDownRight, Zap, AlertCircle, CheckCircle, Calculator } from "lucide-react"
import { useMarketData } from "@/hooks/useMarketData"
import { FormInput, FormButton } from "./enhanced-form-components"

interface MobileTradingTerminalProps {
  symbol: string
}

export default function MobileTradingTerminal({ symbol }: MobileTradingTerminalProps) {
  const { marketData } = useMarketData([symbol])
  const [orderType, setOrderType] = useState("market")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")
  const [stopLoss, setStopLoss] = useState("")
  const [takeProfit, setTakeProfit] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderSuccess, setOrderSuccess] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const currentData = marketData[symbol]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!quantity || Number(quantity) <= 0) {
      newErrors.quantity = "Quantity must be greater than 0"
    }

    if (orderType !== "market" && (!price || Number(price) <= 0)) {
      newErrors.price = "Price is required for non-market orders"
    }

    if (stopLoss && Number(stopLoss) <= 0) {
      newErrors.stopLoss = "Stop loss must be greater than 0"
    }

    if (takeProfit && Number(takeProfit) <= 0) {
      newErrors.takeProfit = "Take profit must be greater than 0"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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

  const handleSubmitOrder = async (side: "buy" | "sell") => {
    if (!validateForm()) return

    setIsSubmitting(true)
    setOrderSuccess(false)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setOrderSuccess(true)
      setQuantity("")
      setPrice("")
      setStopLoss("")
      setTakeProfit("")

      setTimeout(() => setOrderSuccess(false), 3000)
    } catch (error) {
      setErrors({ submit: "Failed to place order. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentData) {
    return (
      <Card className="trading-card">
        <CardContent className="p-4 sm:p-6">
          <div className="text-slate-400 text-center">Loading trading terminal...</div>
        </CardContent>
      </Card>
    )
  }

  const formatPrice = (price: number) => {
    return symbol.includes("/") ? price.toFixed(4) : price.toFixed(2)
  }

  const estimatedTotal =
    quantity && (orderType === "market" ? currentData.price : Number(price) || currentData.price)
      ? ((orderType === "market" ? currentData.price : Number(price) || currentData.price) * Number(quantity)).toFixed(
          2,
        )
      : "0.00"

  return (
    <Card className="trading-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg sm:text-xl text-white">Trading Terminal - {symbol}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <FormButton
            className="bg-emerald-600 hover:bg-emerald-700 h-12 sm:h-14"
            onClick={handleQuickBuy}
            disabled={isSubmitting}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">Quick Buy</div>
              <div className="text-xs opacity-75">${formatPrice(currentData.ask)}</div>
            </div>
          </FormButton>
          <FormButton variant="destructive" className="h-12 sm:h-14" onClick={handleQuickSell} disabled={isSubmitting}>
            <ArrowDownRight className="h-4 w-4 mr-2" />
            <div className="text-left">
              <div className="font-medium">Quick Sell</div>
              <div className="text-xs opacity-75">${formatPrice(currentData.bid)}</div>
            </div>
          </FormButton>
        </div>

        {/* Order Form */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-slate-300 font-medium">Order Type</Label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="bg-slate-800 border-slate-600 form-input-mobile">
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

            <FormInput
              label="Quantity"
              type="number"
              placeholder="100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              error={errors.quantity}
              required
            />
          </div>

          {orderType !== "market" && (
            <FormInput
              label="Price"
              type="number"
              placeholder={formatPrice(currentData.price)}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={errors.price}
              required
            />
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Stop Loss (Optional)"
              type="number"
              placeholder="Optional"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              error={errors.stopLoss}
            />

            <FormInput
              label="Take Profit (Optional)"
              type="number"
              placeholder="Optional"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              error={errors.takeProfit}
            />
          </div>
        </div>

        {/* Order Summary */}
        {quantity && (
          <div className="trading-card p-4 space-y-3 animate-slide-up">
            <div className="flex items-center space-x-2">
              <Calculator className="h-4 w-4 text-emerald-500" />
              <h4 className="font-medium text-white">Order Summary</h4>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-400">Symbol:</span>
                <span className="text-white ml-2 font-medium">{symbol}</span>
              </div>
              <div>
                <span className="text-slate-400">Quantity:</span>
                <span className="text-white ml-2 font-medium">{quantity}</span>
              </div>
              <div>
                <span className="text-slate-400">Est. Price:</span>
                <span className="text-white ml-2 font-medium">
                  ${formatPrice(orderType === "market" ? currentData.price : Number(price) || currentData.price)}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Est. Total:</span>
                <span className="text-emerald-400 ml-2 font-medium">${estimatedTotal}</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errors.submit && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">{errors.submit}</AlertDescription>
          </Alert>
        )}

        {/* Success Display */}
        {orderSuccess && (
          <Alert className="border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-400">Order placed successfully!</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <FormButton
            className="bg-emerald-600 hover:bg-emerald-700"
            onClick={() => handleSubmitOrder("buy")}
            loading={isSubmitting}
            success={orderSuccess}
            disabled={!quantity}
          >
            <ArrowUpRight className="h-4 w-4 mr-2" />
            Place Buy Order
          </FormButton>
          <FormButton
            variant="destructive"
            onClick={() => handleSubmitOrder("sell")}
            loading={isSubmitting}
            success={orderSuccess}
            disabled={!quantity}
          >
            <ArrowDownRight className="h-4 w-4 mr-2" />
            Place Sell Order
          </FormButton>
        </div>

        {/* AI Signal Integration */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium text-white">AI Signal Available</span>
              <Badge className="bg-emerald-600 text-xs">BUY - 94% Confidence</Badge>
            </div>
            <Button size="sm" variant="outline" className="bg-transparent w-full sm:w-auto">
              Use Signal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
