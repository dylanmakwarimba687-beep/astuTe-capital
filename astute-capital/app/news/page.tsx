"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Globe, Clock, BarChart3, Users, Zap, ExternalLink } from "lucide-react"

export default function NewsAnalysis() {
  const marketNews = [
    {
      title: "Fed Signals Potential Rate Cut in Q2 2024",
      summary:
        "Federal Reserve officials hint at possible monetary policy easing amid cooling inflation data and economic uncertainty.",
      impact: "Bullish",
      relevance: 95,
      source: "Reuters",
      time: "2 hours ago",
      affectedSymbols: ["SPY", "QQQ", "AAPL", "MSFT"],
      sentiment: 0.8,
    },
    {
      title: "Apple Reports Record Q4 iPhone Sales",
      summary:
        "Apple Inc. exceeded expectations with iPhone 15 sales driving revenue growth despite supply chain challenges.",
      impact: "Bullish",
      relevance: 88,
      source: "Bloomberg",
      time: "4 hours ago",
      affectedSymbols: ["AAPL"],
      sentiment: 0.9,
    },
    {
      title: "Tesla Faces Production Delays in Shanghai",
      summary:
        "Tesla's Shanghai Gigafactory experiencing temporary production slowdowns due to supply chain disruptions.",
      impact: "Bearish",
      relevance: 82,
      source: "Financial Times",
      time: "6 hours ago",
      affectedSymbols: ["TSLA"],
      sentiment: -0.6,
    },
    {
      title: "Oil Prices Surge on Middle East Tensions",
      summary:
        "Crude oil futures jump 3% as geopolitical tensions escalate, raising concerns about supply disruptions.",
      impact: "Mixed",
      relevance: 78,
      source: "CNBC",
      time: "8 hours ago",
      affectedSymbols: ["XOM", "CVX", "COP"],
      sentiment: 0.2,
    },
  ]

  const socialSentiment = [
    {
      platform: "Twitter",
      symbol: "AAPL",
      sentiment: 0.85,
      mentions: 15420,
      trending: true,
      change: 0.12,
    },
    {
      platform: "Reddit",
      symbol: "TSLA",
      sentiment: -0.32,
      mentions: 8930,
      trending: true,
      change: -0.45,
    },
    {
      platform: "StockTwits",
      symbol: "NVDA",
      sentiment: 0.78,
      mentions: 12340,
      trending: false,
      change: 0.08,
    },
    {
      platform: "Discord",
      symbol: "GME",
      sentiment: 0.65,
      mentions: 5670,
      trending: true,
      change: 0.23,
    },
  ]

  const fundamentalAnalysis = [
    {
      symbol: "AAPL",
      metric: "P/E Ratio",
      value: "28.5",
      benchmark: "25.2",
      status: "Overvalued",
      change: "+2.3",
    },
    {
      symbol: "AAPL",
      metric: "Revenue Growth",
      value: "8.2%",
      benchmark: "6.5%",
      status: "Strong",
      change: "+1.7%",
    },
    {
      symbol: "TSLA",
      metric: "P/E Ratio",
      value: "65.4",
      benchmark: "45.0",
      status: "Overvalued",
      change: "+5.2",
    },
    {
      symbol: "TSLA",
      metric: "Debt-to-Equity",
      value: "0.18",
      benchmark: "0.25",
      status: "Healthy",
      change: "-0.02",
    },
  ]

  return (
    <div className="space-y-6">
      <Tabs defaultValue="news" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
          <TabsTrigger value="news" className="data-[state=active]:bg-emerald-600">
            <Globe className="h-4 w-4 mr-2" />
            Market News
          </TabsTrigger>
          <TabsTrigger value="social" className="data-[state=active]:bg-emerald-600">
            <Users className="h-4 w-4 mr-2" />
            Social Sentiment
          </TabsTrigger>
          <TabsTrigger value="fundamental" className="data-[state=active]:bg-emerald-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Fundamental Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="news" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm text-slate-400">Bullish News</p>
                    <p className="text-xl font-bold">67%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <div>
                    <p className="text-sm text-slate-400">Bearish News</p>
                    <p className="text-xl font-bold">23%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <div>
                    <p className="text-sm text-slate-400">Breaking News</p>
                    <p className="text-xl font-bold">12</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-sm text-slate-400">High Impact</p>
                    <p className="text-xl font-bold">8</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {marketNews.map((news, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge
                          variant={
                            news.impact === "Bullish"
                              ? "default"
                              : news.impact === "Bearish"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {news.impact}
                        </Badge>
                        <Badge variant="outline">{news.relevance}% Relevance</Badge>
                        <span className="text-sm text-slate-400">{news.source}</span>
                      </div>
                      <h3 className="text-lg font-bold mb-2">{news.title}</h3>
                      <p className="text-slate-300 mb-3">{news.summary}</p>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-400">Affected:</span>
                          <div className="flex space-x-1">
                            {news.affectedSymbols.map((symbol) => (
                              <Badge key={symbol} variant="outline" className="text-xs">
                                {symbol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-slate-400">Sentiment:</span>
                          <span
                            className={`text-sm font-medium ${
                              news.sentiment > 0 ? "text-emerald-500" : "text-red-500"
                            }`}
                          >
                            {news.sentiment > 0 ? "+" : ""}
                            {(news.sentiment * 100).toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-slate-400 mb-2">{news.time}</p>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {socialSentiment.map((item, index) => (
              <Card key={index} className="bg-slate-900/50 border-slate-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <span>{item.platform}</span>
                      <Badge variant="outline">{item.symbol}</Badge>
                      {item.trending && (
                        <Badge className="bg-orange-500">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </Badge>
                      )}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Sentiment Score</span>
                      <span className={`text-lg font-bold ${item.sentiment > 0 ? "text-emerald-500" : "text-red-500"}`}>
                        {item.sentiment > 0 ? "+" : ""}
                        {(item.sentiment * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Mentions (24h)</span>
                      <span className="font-medium">{item.mentions.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Change</span>
                      <span
                        className={`font-medium flex items-center ${
                          item.change > 0 ? "text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {item.change > 0 ? (
                          <TrendingUp className="h-3 w-3 mr-1" />
                        ) : (
                          <TrendingDown className="h-3 w-3 mr-1" />
                        )}
                        {item.change > 0 ? "+" : ""}
                        {(item.change * 100).toFixed(0)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fundamental" className="space-y-6">
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle>Fundamental Metrics</CardTitle>
              <CardDescription>Key financial ratios and performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fundamentalAnalysis.map((item, index) => (
                  <div key={index} className="flex items-center justify-between border border-slate-700 rounded-lg p-4">
                    <div className="flex items-center space-x-4">
                      <Badge variant="outline">{item.symbol}</Badge>
                      <div>
                        <p className="font-medium">{item.metric}</p>
                        <p className="text-sm text-slate-400">vs Industry Avg: {item.benchmark}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{item.value}</p>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            item.status === "Strong" || item.status === "Healthy"
                              ? "default"
                              : item.status === "Overvalued"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {item.status}
                        </Badge>
                        <span
                          className={`text-sm ${item.change.startsWith("+") ? "text-emerald-500" : "text-red-500"}`}
                        >
                          {item.change}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
