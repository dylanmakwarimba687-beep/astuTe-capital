"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, PieChart, Activity, Target } from "lucide-react"

export default function Portfolio() {
  const positions = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      quantity: 100,
      avgPrice: 165.5,
      currentPrice: 175.43,
      value: 17543.0,
      pnl: 993.0,
      pnlPercent: 6.0,
      allocation: 25.2,
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      quantity: 5,
      avgPrice: 2900.0,
      currentPrice: 2847.92,
      value: 14239.6,
      pnl: -260.4,
      pnlPercent: -1.8,
      allocation: 20.5,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      quantity: 50,
      avgPrice: 235.8,
      currentPrice: 248.5,
      value: 12425.0,
      pnl: 635.0,
      pnlPercent: 5.38,
      allocation: 17.9,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      quantity: 30,
      avgPrice: 370.25,
      currentPrice: 378.85,
      value: 11365.5,
      pnl: 258.0,
      pnlPercent: 2.32,
      allocation: 16.3,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      quantity: 25,
      avgPrice: 420.0,
      currentPrice: 456.78,
      value: 11419.5,
      pnl: 919.5,
      pnlPercent: 8.75,
      allocation: 16.4,
    },
  ]

  const portfolioStats = {
    totalValue: 69592.6,
    totalCost: 67047.5,
    totalPnL: 2545.1,
    totalPnLPercent: 3.8,
    dayChange: 1247.85,
    dayChangePercent: 1.82,
    cash: 15837.9,
  }

  const performance = [
    { period: "1D", return: 1.82, benchmark: 1.45 },
    { period: "1W", return: 4.23, benchmark: 3.12 },
    { period: "1M", return: 8.67, benchmark: 6.89 },
    { period: "3M", return: 15.34, benchmark: 12.45 },
    { period: "1Y", return: 23.78, benchmark: 18.92 },
  ]

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-emerald-500 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />+{portfolioStats.totalPnLPercent}% total return
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Day P&L</CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+${portfolioStats.dayChange.toLocaleString()}</div>
            <p className="text-xs text-emerald-500">+{portfolioStats.dayChangePercent}% today</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <Target className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-500">+${portfolioStats.totalPnL.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Cost basis: ${portfolioStats.totalCost.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash</CardTitle>
            <PieChart className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioStats.cash.toLocaleString()}</div>
            <p className="text-xs text-slate-400">Available for trading</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Positions */}
        <div className="lg:col-span-2">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Current Positions</CardTitle>
              <CardDescription>Your active holdings and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {positions.map((position) => (
                  <div key={position.symbol} className="border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{position.symbol}</h3>
                        <p className="text-sm text-slate-400">{position.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">${position.value.toLocaleString()}</p>
                        <p className="text-sm text-slate-400">{position.allocation}% of portfolio</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400">Quantity</p>
                        <p className="font-medium">{position.quantity}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Avg Price</p>
                        <p className="font-medium">${position.avgPrice}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">Current Price</p>
                        <p className="font-medium">${position.currentPrice}</p>
                      </div>
                      <div>
                        <p className="text-slate-400">P&L</p>
                        <p
                          className={`font-medium flex items-center ${
                            position.pnl >= 0 ? "text-emerald-500" : "text-red-500"
                          }`}
                        >
                          {position.pnl >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          ${Math.abs(position.pnl).toLocaleString()} ({position.pnlPercent >= 0 ? "+" : ""}
                          {position.pnlPercent}%)
                        </p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Allocation</span>
                        <span>{position.allocation}%</span>
                      </div>
                      <Progress value={position.allocation} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance & Allocation */}
        <div className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Performance vs Benchmark</CardTitle>
              <CardDescription>S&P 500 comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performance.map((perf) => (
                  <div key={perf.period} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{perf.period}</span>
                    <div className="text-right">
                      <div className="text-sm">
                        <span className={perf.return >= 0 ? "text-emerald-500" : "text-red-500"}>
                          {perf.return >= 0 ? "+" : ""}
                          {perf.return}%
                        </span>
                        <span className="text-slate-400 ml-2">
                          vs {perf.benchmark >= 0 ? "+" : ""}
                          {perf.benchmark}%
                        </span>
                      </div>
                      <Badge variant={perf.return > perf.benchmark ? "default" : "secondary"} className="text-xs">
                        {perf.return > perf.benchmark ? "Outperforming" : "Underperforming"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Portfolio Allocation</CardTitle>
              <CardDescription>Asset distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {positions.map((position) => (
                  <div key={position.symbol} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      <span className="text-sm">{position.symbol}</span>
                    </div>
                    <span className="text-sm font-medium">{position.allocation}%</span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-slate-700 pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-slate-500"></div>
                    <span className="text-sm">Cash</span>
                  </div>
                  <span className="text-sm font-medium">18.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
