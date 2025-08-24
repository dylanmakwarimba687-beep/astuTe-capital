"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Trophy,
  Users,
  Calendar,
  DollarSign,
  Target,
  Clock,
  Star,
  Award,
  Zap,
  Crown,
  Timer,
  BarChart3,
  Briefcase,
  Building,
  CheckCircle,
  Play,
  Eye,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import AuthGuard from "@/components/auth-guard"
import ResponsiveLayout from "@/components/responsive-layout"

interface Competition {
  id: string
  title: string
  description: string
  prize: string
  participants: number
  maxParticipants: number
  startDate: string
  endDate: string
  status: "upcoming" | "active" | "ended"
  entryFee: number
  rules: string[]
  leaderboard: Array<{
    rank: number
    name: string
    avatar?: string
    pnl: number
    roi: number
    trades: number
  }>
}

interface PropFirm {
  id: string
  name: string
  logo: string
  description: string
  maxFunding: string
  profitTarget: number
  maxDrawdown: number
  tradingPeriod: number
  evaluationFee: number
  profitSplit: number
  instruments: string[]
  rating: number
  reviews: number
  features: string[]
  status: "available" | "popular" | "premium"
}

export default function CompetitionsPage() {
  const { user, isPremium } = useAppStore()
  const [activeCompetition, setActiveCompetition] = useState<string | null>(null)

  const competitions: Competition[] = [
    {
      id: "1",
      title: "AstuteCapital Monthly Championship",
      description: "Compete with traders worldwide in our flagship monthly competition",
      prize: "$50,000",
      participants: 1247,
      maxParticipants: 2000,
      startDate: "2024-01-01",
      endDate: "2024-01-31",
      status: "active",
      entryFee: 99,
      rules: [
        "Maximum 5% daily drawdown",
        "No overnight positions on weekends",
        "Minimum 20 trades required",
        "Real-time monitoring required",
      ],
      leaderboard: [
        { rank: 1, name: "Alex Chen", pnl: 15420, roi: 24.8, trades: 156 },
        { rank: 2, name: "Sarah Johnson", pnl: 14890, roi: 23.2, trades: 142 },
        { rank: 3, name: "Mike Rodriguez", pnl: 13750, roi: 21.9, trades: 178 },
        { rank: 4, name: "Emma Wilson", pnl: 12980, roi: 20.1, trades: 134 },
        { rank: 5, name: "David Kim", pnl: 11560, roi: 18.7, trades: 167 },
      ],
    },
    {
      id: "2",
      title: "Forex Masters Challenge",
      description: "Specialized forex trading competition with major currency pairs",
      prize: "$25,000",
      participants: 856,
      maxParticipants: 1500,
      startDate: "2024-01-15",
      endDate: "2024-02-15",
      status: "active",
      entryFee: 49,
      rules: [
        "Forex pairs only (EUR/USD, GBP/USD, USD/JPY, etc.)",
        "Maximum 3% daily drawdown",
        "Minimum 15 trades required",
        "No scalping strategies allowed",
      ],
      leaderboard: [
        { rank: 1, name: "James Liu", pnl: 8940, roi: 17.9, trades: 89 },
        { rank: 2, name: "Maria Garcia", pnl: 8120, roi: 16.2, trades: 76 },
        { rank: 3, name: "Tom Anderson", pnl: 7650, roi: 15.3, trades: 94 },
      ],
    },
    {
      id: "3",
      title: "Crypto Elite Tournament",
      description: "High-stakes cryptocurrency trading competition",
      prize: "$100,000",
      participants: 0,
      maxParticipants: 500,
      startDate: "2024-02-01",
      endDate: "2024-02-29",
      status: "upcoming",
      entryFee: 199,
      rules: [
        "Cryptocurrency pairs only",
        "Maximum 8% daily drawdown",
        "24/7 trading allowed",
        "Minimum $10,000 starting capital",
      ],
      leaderboard: [],
    },
  ]

  const propFirms: PropFirm[] = [
    {
      id: "1",
      name: "FTMO",
      logo: "/placeholder.svg?height=40&width=120&text=FTMO",
      description: "Leading prop trading firm with proven track record",
      maxFunding: "$400,000",
      profitTarget: 10,
      maxDrawdown: 5,
      tradingPeriod: 30,
      evaluationFee: 540,
      profitSplit: 80,
      instruments: ["Forex", "Indices", "Commodities", "Crypto"],
      rating: 4.8,
      reviews: 12450,
      features: ["No time limit", "Weekend holding allowed", "News trading allowed", "Expert advisors allowed"],
      status: "popular",
    },
    {
      id: "2",
      name: "MyForexFunds",
      logo: "/placeholder.svg?height=40&width=120&text=MFF",
      description: "Fast-growing prop firm with competitive conditions",
      maxFunding: "$300,000",
      profitTarget: 8,
      maxDrawdown: 4,
      tradingPeriod: 21,
      evaluationFee: 399,
      profitSplit: 85,
      instruments: ["Forex", "Indices", "Commodities"],
      rating: 4.6,
      reviews: 8920,
      features: ["Quick payouts", "Scaling plan available", "Mobile trading", "Copy trading allowed"],
      status: "available",
    },
    {
      id: "3",
      name: "The5%ers",
      logo: "/placeholder.svg?height=40&width=120&text=5ERS",
      description: "Unique instant funding model with high profit splits",
      maxFunding: "$4,000,000",
      profitTarget: 6,
      maxDrawdown: 4,
      tradingPeriod: 180,
      evaluationFee: 230,
      profitSplit: 100,
      instruments: ["Forex", "Indices", "Commodities", "Stocks"],
      rating: 4.9,
      reviews: 15670,
      features: ["Instant funding", "100% profit split", "No time limits", "Aggressive scaling"],
      status: "premium",
    },
    {
      id: "4",
      name: "Funded Next",
      logo: "/placeholder.svg?height=40&width=120&text=FN",
      description: "Innovative prop firm with flexible trading conditions",
      maxFunding: "$200,000",
      profitTarget: 8,
      maxDrawdown: 5,
      tradingPeriod: 30,
      evaluationFee: 99,
      profitSplit: 90,
      instruments: ["Forex", "Indices", "Crypto"],
      rating: 4.4,
      reviews: 6780,
      features: ["Low evaluation fees", "High profit split", "Crypto trading", "Weekend trading"],
      status: "available",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "upcoming":
        return "bg-blue-500"
      case "ended":
        return "bg-gray-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPropFirmStatusColor = (status: string) => {
    switch (status) {
      case "popular":
        return "bg-orange-500"
      case "premium":
        return "bg-purple-500"
      default:
        return "bg-blue-500"
    }
  }

  return (
    <AuthGuard>
      <ResponsiveLayout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Trading Competitions & Prop Firms</h1>
                <p className="text-slate-400 mt-2">
                  Compete with the best traders and get funded by top proprietary trading firms
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge className="bg-emerald-600">
                  <Trophy className="h-3 w-3 mr-1" />
                  {isPremium ? "Premium Access" : "Basic Access"}
                </Badge>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="trading-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm text-slate-400">Active Competitions</p>
                      <p className="text-xl font-bold text-white">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="trading-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-slate-400">Total Participants</p>
                      <p className="text-xl font-bold text-white">15,420</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="trading-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-slate-400">Total Prizes</p>
                      <p className="text-xl font-bold text-white">$2.5M</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="trading-card">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Building className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-slate-400">Prop Firms</p>
                      <p className="text-xl font-bold text-white">25+</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="competitions" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800">
              <TabsTrigger value="competitions" className="data-[state=active]:bg-emerald-600">
                <Trophy className="h-4 w-4 mr-2" />
                Competitions
              </TabsTrigger>
              <TabsTrigger value="propfirms" className="data-[state=active]:bg-emerald-600">
                <Briefcase className="h-4 w-4 mr-2" />
                Prop Firms
              </TabsTrigger>
            </TabsList>

            {/* Competitions Tab */}
            <TabsContent value="competitions" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {competitions.map((competition) => (
                  <Card key={competition.id} className="trading-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white flex items-center space-x-2">
                            <span>{competition.title}</span>
                            <Badge className={getStatusColor(competition.status)}>{competition.status}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">{competition.description}</CardDescription>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-400">{competition.prize}</p>
                          <p className="text-sm text-slate-400">Prize Pool</p>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Competition Info */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-300">
                            {competition.participants}/{competition.maxParticipants} participants
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-300">Entry: ${competition.entryFee}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-300">
                            {new Date(competition.startDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-300">
                            {new Date(competition.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Participants</span>
                          <span className="text-slate-300">
                            {Math.round((competition.participants / competition.maxParticipants) * 100)}%
                          </span>
                        </div>
                        <Progress
                          value={(competition.participants / competition.maxParticipants) * 100}
                          className="h-2"
                        />
                      </div>

                      {/* Leaderboard Preview */}
                      {competition.leaderboard.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-white flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2" />
                            Top Performers
                          </h4>
                          <div className="space-y-2">
                            {competition.leaderboard.slice(0, 3).map((trader) => (
                              <div
                                key={trader.rank}
                                className="flex items-center justify-between p-2 bg-slate-800 rounded"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">
                                    {trader.rank}
                                  </div>
                                  <span className="text-sm text-white">{trader.name}</span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-semibold text-emerald-400">
                                    ${trader.pnl.toLocaleString()}
                                  </p>
                                  <p className="text-xs text-slate-400">{trader.roi}% ROI</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        {competition.status === "active" && (
                          <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                            <Play className="h-4 w-4 mr-2" />
                            Join Competition
                          </Button>
                        )}
                        {competition.status === "upcoming" && (
                          <Button className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Timer className="h-4 w-4 mr-2" />
                            Register Now
                          </Button>
                        )}
                        <Button variant="outline" className="border-slate-600 bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Prop Firms Tab */}
            <TabsContent value="propfirms" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {propFirms.map((firm) => (
                  <Card key={firm.id} className="trading-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <img src={firm.logo || "/placeholder.svg"} alt={firm.name} className="h-10 w-auto" />
                          <div>
                            <CardTitle className="text-white flex items-center space-x-2">
                              <span>{firm.name}</span>
                              <Badge className={getPropFirmStatusColor(firm.status)}>{firm.status}</Badge>
                            </CardTitle>
                            <div className="flex items-center space-x-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${
                                    i < Math.floor(firm.rating) ? "text-yellow-400 fill-current" : "text-slate-600"
                                  }`}
                                />
                              ))}
                              <span className="text-xs text-slate-400 ml-1">
                                {firm.rating} ({firm.reviews.toLocaleString()} reviews)
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-emerald-400">{firm.maxFunding}</p>
                          <p className="text-sm text-slate-400">Max Funding</p>
                        </div>
                      </div>
                      <CardDescription>{firm.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Key Metrics */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Profit Target</span>
                            <span className="text-sm text-white">{firm.profitTarget}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Max Drawdown</span>
                            <span className="text-sm text-white">{firm.maxDrawdown}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Trading Period</span>
                            <span className="text-sm text-white">{firm.tradingPeriod} days</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Evaluation Fee</span>
                            <span className="text-sm text-white">${firm.evaluationFee}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Profit Split</span>
                            <span className="text-sm text-emerald-400">{firm.profitSplit}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-slate-400">Instruments</span>
                            <span className="text-sm text-white">{firm.instruments.length}</span>
                          </div>
                        </div>
                      </div>

                      <Separator className="bg-slate-700" />

                      {/* Features */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-emerald-500" />
                          Key Features
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {firm.features.map((feature, index) => (
                            <div key={index} className="flex items-center space-x-2">
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                              <span className="text-sm text-slate-300">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Instruments */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-white">Available Instruments</h4>
                        <div className="flex flex-wrap gap-2">
                          {firm.instruments.map((instrument) => (
                            <Badge key={instrument} variant="outline" className="border-slate-600 text-slate-300">
                              {instrument}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          <Zap className="h-4 w-4 mr-2" />
                          Start Challenge
                        </Button>
                        <Button variant="outline" className="border-slate-600 bg-transparent">
                          <Eye className="h-4 w-4 mr-2" />
                          Learn More
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="trading-card">
                <CardContent className="p-6 text-center">
                  <Crown className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Ready to Get Funded?</h3>
                  <p className="text-slate-400 mb-4">
                    Join thousands of successful traders who have secured funding through our partner prop firms
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Award className="h-4 w-4 mr-2" />
                      Browse All Firms
                    </Button>
                    <Button variant="outline" className="border-slate-600 bg-transparent">
                      <Target className="h-4 w-4 mr-2" />
                      Take Assessment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </ResponsiveLayout>
    </AuthGuard>
  )
}
