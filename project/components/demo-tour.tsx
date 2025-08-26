"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, X, Lightbulb, TrendingUp, Zap, PieChart, Target } from "lucide-react"
import { useAppStore } from "@/lib/store"

interface TourStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  tab?: string
  highlight?: string
}

const tourSteps: TourStep[] = [
  {
    id: "welcome",
    title: "Welcome to TradePro Demo!",
    description:
      "Explore our professional trading platform with real-time market data, AI signals, and portfolio management. All data shown is simulated for demonstration.",
    icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
  },
  {
    id: "dashboard",
    title: "Portfolio Dashboard",
    description:
      "View your portfolio performance, daily P&L, win rates, and AI signal accuracy. The dashboard provides a comprehensive overview of your trading activity.",
    icon: <PieChart className="h-5 w-5 text-emerald-500" />,
    tab: "dashboard",
  },
  {
    id: "trading",
    title: "Live Trading Terminal",
    description:
      "Execute trades with real-time charts, market depth, and order management. Place market or limit orders with built-in risk management tools.",
    icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
    tab: "trading",
  },
  {
    id: "signals",
    title: "AI Trading Signals",
    description:
      "Get AI-powered trading recommendations with confidence levels, price targets, and detailed analysis. Premium signals offer 90%+ accuracy.",
    icon: <Zap className="h-5 w-5 text-yellow-500" />,
    tab: "signals",
  },
  {
    id: "analysis",
    title: "Market Analysis",
    description:
      "Stay informed with market news, social sentiment analysis, and fundamental data. Make informed decisions with comprehensive market insights.",
    icon: <Target className="h-5 w-5 text-purple-500" />,
    tab: "news",
  },
]

export default function DemoTour() {
  const { isDemoMode, showDemoTour, setShowDemoTour, setActiveTab } = useAppStore()
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isDemoMode && showDemoTour) {
      // Show tour after a brief delay
      const timer = setTimeout(() => setIsVisible(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [isDemoMode, showDemoTour])

  if (!isDemoMode || !showDemoTour || !isVisible) return null

  const currentTourStep = tourSteps[currentStep]

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)

      // Switch to the relevant tab if specified
      if (tourSteps[nextStep].tab) {
        setActiveTab(tourSteps[nextStep].tab)
      }
    } else {
      handleClose()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)

      // Switch to the relevant tab if specified
      if (tourSteps[prevStep].tab) {
        setActiveTab(tourSteps[prevStep].tab)
      }
    }
  }

  const handleClose = () => {
    setShowDemoTour(false)
    setIsVisible(false)
  }

  const handleSkip = () => {
    setShowDemoTour(false)
    setIsVisible(false)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-slate-900/95 backdrop-blur-sm border-slate-700 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <Badge variant="outline" className="border-blue-400 text-blue-400">
              Step {currentStep + 1} of {tourSteps.length}
            </Badge>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-6 w-6">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">{currentTourStep.icon}</div>
            <h3 className="text-xl font-bold text-white mb-2">{currentTourStep.title}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{currentTourStep.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-slate-400"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button variant="ghost" size="sm" onClick={handleSkip} className="text-slate-400">
                Skip Tour
              </Button>
              <Button size="sm" onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                {currentStep === tourSteps.length - 1 ? "Get Started" : "Next"}
                {currentStep < tourSteps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex justify-center mt-4 space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentStep ? "bg-blue-500" : "bg-slate-600"
                }`}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
