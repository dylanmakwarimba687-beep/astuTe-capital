"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Briefcase,
  Trophy,
  Target,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Star,
  Shield,
} from "lucide-react"
import { useAppStore } from "@/lib/store"

interface PropFirm {
  id: string
  name: string
  logo: string
  accountSize: number
  profitTarget: number
  maxDrawdown: number
  profitSplit: number
  evaluationFee: number
  tradingDays: number
  successRate: number
  avgCompletionTime: number
  challengeType: "evaluation" | "two-step" | "instant"
  newsTrading: boolean
  weekendHolding: boolean
  eaAllowed: boolean
  description: string
  features: string[]
}

interface Challenge {
  id: string
  firmId: string
  firmName: string
  accountSize: number
  status: "active" | "passed" | "failed" | "pending"
  currentPnL: number
  profitTarget: number
  maxDrawdown: number
  currentDrawdown: number
  tradingDays: number
  daysRemaining: number
  totalTrades: number
  winRate: number
  startDate: string
  endDate?: string
}

const propFirms: PropFirm[] = [
  {
    id: "ftmo",
    name: "FTMO",
    logo: "🏢",
    accountSize: 100000,
    profitTarget: 10,
    maxDrawdown: 10,
    profitSplit: 80,
    evaluationFee: 540,
    tradingDays: 30,
    successRate: 23,
    avgCompletionTime: 18,
    challengeType: "two-step",
    newsTrading: false,
    weekendHolding: true,
    eaAllowed: true,
    description: "Leading prop firm with proven track record",
    features: ["Two-step evaluation", "Scaling plan", "Bi-weekly payouts", "No time limit on funded account"],
  },
  {
    id: "myforexfunds",
    name: "MyForexFunds",
    logo: "💰",
    accountSize: 200000,
    profitTarget: 8,
    maxDrawdown: 5,
    profitSplit: 85,
    evaluationFee: 399,
    tradingDays: 30,
    successRate: 28,
    avgCompletionTime: 16,
    challengeType: "evaluation",
    newsTrading: true,
    weekendHolding: true,
    eaAllowed: true,
    description: "High profit split with flexible trading conditions",
    features: ["Single-step evaluation", "High profit split", "News trading allowed", "Weekend holding allowed"],
  },
  {
    id: "the5ers",
    name: "The5%ers",
    logo: "⚡",
    accountSize: 50000,
    profitTarget: 6,
    maxDrawdown: 4,
    profitSplit: 100,
    evaluationFee: 299,
    tradingDays: 60,
    successRate: 35,
    avgCompletionTime: 25,
    challengeType: "instant",
    newsTrading: true,
    weekendHolding: false,
    eaAllowed: false,
    description: "Instant funding with 100% profit split",
    features: ["Instant funding", "100% profit split", "Aggressive scaling", "High-frequency trading allowed"],
  },
  {
    id: "fundednext",
    name: "Funded Next",
    logo: "🚀",
    accountSize: 25000,
    profitTarget: 8,
    maxDrawdown: 8,
    profitSplit: 90,
    evaluationFee: 99,
    tradingDays: 30,
    successRate: 42,
    avgCompletionTime: 14,
    challengeType: "evaluation",
    newsTrading: true,
    weekendHolding: true,
    eaAllowed: true,
    description: "Beginner-friendly with high success rate",
    features: ["Low evaluation fee", "Beginner-friendly", "High success rate", "Quick evaluation"],
  },
]

const myChallenges: Challenge[] = [
  {
    id: "1",
    firmId: "ftmo",
    firmName: "FTMO",
    accountSize: 100000,
    status: "active",
    currentPnL: 6500,
    profitTarget: 10000,
    maxDrawdown: 10000,
    currentDrawdown: 2300,
    tradingDays: 18,
    daysRemaining: 12,
    totalTrades: 45,
    winRate: 67,
    startDate: "2024-01-15",
  },
  {
    id: "2",
    firmId: "myforexfunds",
    firmName: "MyForexFunds",
    accountSize: 200000,
    status: "passed",
    currentPnL: 18500,
    profitTarget: 16000,
    maxDrawdown: 10000,
    currentDrawdown: 1200,
    tradingDays: 22,
    daysRemaining: 0,
    totalTrades: 38,
    winRate: 74,
    startDate: "2023-12-01",
    endDate: "2023-12-23",
  },
  {
    id: "3",
    firmId: "the5ers",
    firmName: "The5%ers",
    accountSize: 50000,
    status: "failed",
    currentPnL: -2100,
    profitTarget: 3000,
    maxDrawdown: 2000,
    currentDrawdown: 2100,
    tradingDays: 8,
    daysRemaining: 0,
    totalTrades: 12,
    winRate: 25,
    startDate: "2023-11-10",
    endDate: "2023-11-18",
  },
]

export default function ChallengesPage() {
  const { user, isPremium } = useAppStore()
  const [activeTab, setActiveTab] = useState("available")
  const [filterDifficulty, setFilterDifficulty] = useState("all")
  const [filterAccountSize, setFilterAccountSize] = useState("all")
  const [sortBy, setSortBy] = useState("success-rate")
  const [selectedFirm, setSelectedFirm] = useState<PropFirm | null>(null)
  const [showApplicationDialog, setShowApplicationDialog] = useState(false)

  const filteredFirms = propFirms
    .filter((firm) => {
      if (filterDifficulty !== "all") {
        const difficulty = firm.successRate > 35 ? "easy" : firm.successRate > 25 ? "medium" : "hard"
        if (difficulty !== filterDifficulty) return false
      }
      if (filterAccountSize !== "all") {
        if (filterAccountSize === "small" && firm.accountSize > 50000) return false
        if (filterAccountSize === "medium" && (firm.accountSize <= 50000 || firm.accountSize > 100000)) return false
        if (filterAccountSize === "large" && firm.accountSize <= 100000) return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "success-rate":
          return b.successRate - a.successRate
        case "account-size":
          return b.accountSize - a.accountSize
        case "profit-split":
          return b.profitSplit - a.profitSplit
        case "evaluation-fee":
          return a.evaluationFee - b.evaluationFee
        default:
          return 0
      }
    })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-600"
      case "passed":
        return "bg-green-600"
      case "failed":
        return "bg-red-600"
      case "pending":
        return "bg-yellow-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4" />
      case "passed":
        return <CheckCircle className="h-4 w-4" />
      case "failed":
        return <XCircle className="h-4 w-4" />
      case "pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getDifficultyBadge = (successRate: number) => {
    if (successRate > 35) return <Badge className="bg-green-600">Easy</Badge>
    if (successRate > 25) return <Badge className="bg-yellow-600">Medium</Badge>
    return <Badge className="bg-red-600">Hard</Badge>
  }

  const handleApplyChallenge = (firm: PropFirm) => {
    setSelectedFirm(firm)
    setShowApplicationDialog(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center">
            <Briefcase className="h-8 w-8 mr-3 text-emerald-500" />
            Prop Firm Challenges
          </h1>
          <p className="text-slate-400 mt-1">Get funded by top proprietary trading firms</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge className="bg-emerald-600">
            <Trophy className="h-3 w-3 mr-1" />
            {myChallenges.filter((c) => c.status === "passed").length} Passed
          </Badge>
          <Badge className="bg-blue-600">
            <Target className="h-3 w-3 mr-1" />
            {myChallenges.filter((c) => c.status === "active").length} Active
          </Badge>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Available Firms</CardTitle>
            <Briefcase className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{propFirms.length}</div>
            <p className="text-xs text-slate-400">Top-tier prop firms</p>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Max Funding</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">$4M</div>
            <p className="text-xs text-emerald-400">Available capital</p>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Avg Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">25%</div>
            <p className="text-xs text-yellow-400">Industry average</p>
          </CardContent>
        </Card>

        <Card className="trading-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">My Challenges</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{myChallenges.length}</div>
            <p className="text-xs text-blue-400">Total attempts</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-slate-800">
          <TabsTrigger value="available" className="data-[state=active]:bg-emerald-600">
            Available Challenges
          </TabsTrigger>
          <TabsTrigger value="my-challenges" className="data-[state=active]:bg-emerald-600">
            My Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="space-y-6">
          {/* Filters */}
          <Card className="trading-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters & Sorting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label className="text-slate-400">Difficulty</Label>
                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="easy">Easy (35%+ success)</SelectItem>
                      <SelectItem value="medium">Medium (25-35% success)</SelectItem>
                      <SelectItem value="hard">Hard (&lt;25% success)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-400">Account Size</Label>
                  <Select value={filterAccountSize} onValueChange={setFilterAccountSize}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sizes</SelectItem>
                      <SelectItem value="small">Small (&lt;$50K)</SelectItem>
                      <SelectItem value="medium">Medium ($50K-$100K)</SelectItem>
                      <SelectItem value="large">Large ($100K+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-slate-400">Sort By</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success-rate">Success Rate</SelectItem>
                      <SelectItem value="account-size">Account Size</SelectItem>
                      <SelectItem value="profit-split">Profit Split</SelectItem>
                      <SelectItem value="evaluation-fee">Evaluation Fee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => {
                      setFilterDifficulty("all")
                      setFilterAccountSize("all")
                      setSortBy("success-rate")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Challenges */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredFirms.map((firm) => (
              <Card key={firm.id} className="trading-card hover:border-emerald-500 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{firm.logo}</div>
                      <div>
                        <CardTitle className="text-white">{firm.name}</CardTitle>
                        <p className="text-sm text-slate-400">{firm.description}</p>
                      </div>
                    </div>
                    {getDifficultyBadge(firm.successRate)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-white">${firm.accountSize.toLocaleString()}</div>
                      <div className="text-xs text-slate-400">Account Size</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-emerald-400">{firm.profitSplit}%</div>
                      <div className="text-xs text-slate-400">Profit Split</div>
                    </div>
                  </div>

                  {/* Challenge Details */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Profit Target:</span>
                      <span className="text-white">{firm.profitTarget}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Max Drawdown:</span>
                      <span className="text-white">{firm.maxDrawdown}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Trading Days:</span>
                      <span className="text-white">{firm.tradingDays} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Success Rate:</span>
                      <span className="text-white">{firm.successRate}%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Evaluation Fee:</span>
                      <span className="text-white">${firm.evaluationFee}</span>
                    </div>
                  </div>

                  {/* Trading Conditions */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Trading Conditions:</h4>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={firm.newsTrading ? "default" : "secondary"} className="text-xs">
                        {firm.newsTrading ? "✓" : "✗"} News Trading
                      </Badge>
                      <Badge variant={firm.weekendHolding ? "default" : "secondary"} className="text-xs">
                        {firm.weekendHolding ? "✓" : "✗"} Weekend Holding
                      </Badge>
                      <Badge variant={firm.eaAllowed ? "default" : "secondary"} className="text-xs">
                        {firm.eaAllowed ? "✓" : "✗"} EA Allowed
                      </Badge>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-white">Key Features:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {firm.features.map((feature, index) => (
                        <li key={index} className="flex items-center">
                          <Star className="h-3 w-3 mr-2 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => handleApplyChallenge(firm)}
                  >
                    Apply for Challenge - ${firm.evaluationFee}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-challenges" className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {myChallenges.map((challenge) => (
              <Card key={challenge.id} className="trading-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{propFirms.find((f) => f.id === challenge.firmId)?.logo}</div>
                      <div>
                        <CardTitle className="text-white">{challenge.firmName}</CardTitle>
                        <p className="text-sm text-slate-400">${challenge.accountSize.toLocaleString()} Challenge</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(challenge.status)}>
                      {getStatusIcon(challenge.status)}
                      <span className="ml-1 capitalize">{challenge.status}</span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Progress Bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Profit Target Progress</span>
                        <span className="text-white">
                          ${challenge.currentPnL.toLocaleString()} / ${challenge.profitTarget.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(challenge.currentPnL / challenge.profitTarget) * 100} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Drawdown</span>
                        <span className="text-white">
                          ${challenge.currentDrawdown.toLocaleString()} / ${challenge.maxDrawdown.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={(challenge.currentDrawdown / challenge.maxDrawdown) * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-white">{challenge.tradingDays}</div>
                      <div className="text-xs text-slate-400">Trading Days</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-white">{challenge.daysRemaining}</div>
                      <div className="text-xs text-slate-400">Days Left</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-white">{challenge.totalTrades}</div>
                      <div className="text-xs text-slate-400">Total Trades</div>
                    </div>
                    <div className="text-center p-3 bg-slate-700 rounded-lg">
                      <div className="text-lg font-bold text-white">{challenge.winRate}%</div>
                      <div className="text-xs text-slate-400">Win Rate</div>
                    </div>
                  </div>

                  {/* Current P&L */}
                  <div className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                    <div className="flex items-center space-x-2">
                      {challenge.currentPnL >= 0 ? (
                        <ArrowUpRight className="h-5 w-5 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-red-500" />
                      )}
                      <span className="text-slate-400">Current P&L:</span>
                    </div>
                    <span
                      className={`text-lg font-bold ${challenge.currentPnL >= 0 ? "text-green-500" : "text-red-500"}`}
                    >
                      {challenge.currentPnL >= 0 ? "+" : ""}${challenge.currentPnL.toLocaleString()}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {challenge.status === "active" && (
                      <>
                        <Button variant="outline" className="flex-1 bg-transparent">
                          View Details
                        </Button>
                        <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Continue Trading</Button>
                      </>
                    )}
                    {challenge.status === "passed" && (
                      <Button className="w-full bg-green-600 hover:bg-green-700">Claim Funded Account</Button>
                    )}
                    {challenge.status === "failed" && (
                      <Button variant="outline" className="w-full bg-transparent">
                        Retry Challenge
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Dialog */}
      <Dialog open={showApplicationDialog} onOpenChange={setShowApplicationDialog}>
        <DialogContent className="max-w-2xl bg-slate-800 border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Apply for {selectedFirm?.name} Challenge
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {selectedFirm && (
              <>
                {/* Challenge Summary */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="text-white font-medium mb-2">Challenge Summary</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-400">Account Size:</span>
                      <span className="text-white ml-2">${selectedFirm.accountSize.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Profit Target:</span>
                      <span className="text-white ml-2">{selectedFirm.profitTarget}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Max Drawdown:</span>
                      <span className="text-white ml-2">{selectedFirm.maxDrawdown}%</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Evaluation Fee:</span>
                      <span className="text-white ml-2">${selectedFirm.evaluationFee}</span>
                    </div>
                  </div>
                </div>

                {/* Application Form */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-400">Trading Experience (years)</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-1">0-1 years</SelectItem>
                          <SelectItem value="1-3">1-3 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="5+">5+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-slate-400">Trading Style</Label>
                      <Select>
                        <SelectTrigger className="bg-slate-700 border-slate-600">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scalping">Scalping</SelectItem>
                          <SelectItem value="day-trading">Day Trading</SelectItem>
                          <SelectItem value="swing-trading">Swing Trading</SelectItem>
                          <SelectItem value="position-trading">Position Trading</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label className="text-slate-400">Risk Management Strategy</Label>
                    <Textarea
                      placeholder="Describe your risk management approach..."
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="terms" />
                      <Label htmlFor="terms" className="text-slate-400 text-sm">
                        I agree to the challenge terms and conditions
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="risk" />
                      <Label htmlFor="risk" className="text-slate-400 text-sm">
                        I understand the risks involved in prop trading
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="p-4 bg-slate-700 rounded-lg">
                  <h3 className="text-white font-medium mb-4 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure Payment
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label className="text-slate-400">Card Number</Label>
                      <Input placeholder="1234 5678 9012 3456" className="bg-slate-600 border-slate-500 text-white" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-slate-400">Expiry Date</Label>
                        <Input placeholder="MM/YY" className="bg-slate-600 border-slate-500 text-white" />
                      </div>
                      <div>
                        <Label className="text-slate-400">CVV</Label>
                        <Input placeholder="123" className="bg-slate-600 border-slate-500 text-white" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => setShowApplicationDialog(false)}
                  >
                    Cancel
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        Pay ${selectedFirm.evaluationFee} & Start Challenge
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-800 border-slate-700">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Confirm Challenge Application</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                          You are about to pay ${selectedFirm.evaluationFee} to start the {selectedFirm.name} challenge.
                          This payment is non-refundable. Are you sure you want to proceed?
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-slate-700 text-white border-slate-600">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => {
                            setShowApplicationDialog(false)
                            // Handle payment and challenge creation
                          }}
                        >
                          Confirm Payment
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
