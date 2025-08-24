"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Settings,
  X,
  User,
  Bell,
  BarChart3,
  Palette,
  Shield,
  Building,
  Moon,
  Sun,
  UserPlus,
  LogIn,
  Crown,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [user, setUser] = useState<any>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [settings, setSettings] = useState({
    theme: "dark",
    notifications: {
      signals: true,
      trades: true,
      news: true,
      system: false,
    },
    charts: {
      defaultType: "candlestick",
      timeframe: "1h",
      indicators: ["sma", "rsi"],
      theme: "dark",
    },
    trading: {
      confirmOrders: true,
      defaultQuantity: 100,
      riskManagement: true,
    },
    display: {
      currency: "USD",
      timezone: "EST",
      compactMode: false,
    },
  })

  const router = useRouter()

  useEffect(() => {
    // Load user data from localStorage
    const userData = localStorage.getItem("user")
    const demoMode = localStorage.getItem("demoMode") === "true"

    if (userData) {
      setUser(JSON.parse(userData))
    }
    setIsDemoMode(demoMode)
  }, [])

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value,
      },
    }))
  }

  const handleThemeChange = (theme: string) => {
    setSettings((prev) => ({ ...prev, theme }))
    // Apply theme change to document
    document.documentElement.classList.toggle("dark", theme === "dark")
  }

  const handleSignUp = () => {
    onClose()
    router.push("/auth/signup")
  }

  const handleLogin = () => {
    onClose()
    router.push("/auth/login")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-slate-900 border-l border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Settings</h2>
            {isDemoMode && (
              <Badge variant="outline" className="text-xs border-amber-500 text-amber-500">
                DEMO
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {/* Demo Mode Authentication */}
            {isDemoMode && !user && (
              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/20 border-emerald-700/50">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Crown className="h-5 w-5 mr-2 text-emerald-400" />
                    Unlock Full Features
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300 text-sm">
                    You're currently in demo mode. Create an account or sign in to access all premium features, save
                    your preferences, and connect with real brokers.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleSignUp} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      <UserPlus className="h-4 w-4 mr-2" />
                      Sign Up
                    </Button>
                    <Button
                      onClick={handleLogin}
                      variant="outline"
                      className="border-emerald-600 text-emerald-400 hover:bg-emerald-600/10 bg-transparent"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Log In
                    </Button>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p>✨ Premium features include:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Real-time trading signals</li>
                      <li>Advanced customization</li>
                      <li>Broker integrations</li>
                      <li>Portfolio tracking</li>
                      <li>Priority support</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Account Information */}
            {user && (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <User className="h-5 w-5 mr-2" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-slate-300">First Name</Label>
                      <Input value={user.firstName} className="bg-slate-700 border-slate-600 text-white" readOnly />
                    </div>
                    <div>
                      <Label className="text-slate-300">Last Name</Label>
                      <Input value={user.lastName} className="bg-slate-700 border-slate-600 text-white" readOnly />
                    </div>
                  </div>
                  <div>
                    <Label className="text-slate-300">Email</Label>
                    <Input value={user.email} className="bg-slate-700 border-slate-600 text-white" readOnly />
                  </div>
                  <div>
                    <Label className="text-slate-300">Member Since</Label>
                    <Input
                      value={new Date(user.createdAt).toLocaleDateString()}
                      className="bg-slate-700 border-slate-600 text-white"
                      readOnly
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Broker Connections */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Building className="h-5 w-5 mr-2" />
                  Broker Connections
                  {isDemoMode && (
                    <Badge variant="outline" className="ml-2 text-xs border-amber-500 text-amber-500">
                      Demo Only
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {user?.brokers?.map((broker: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-white">{broker.name}</p>
                      <p className="text-sm text-slate-400">Account: {broker.accountId}</p>
                      <p className="text-sm text-slate-400">Balance: ${broker.balance?.toLocaleString()}</p>
                    </div>
                    <Badge variant={broker.status === "connected" ? "default" : "secondary"}>{broker.status}</Badge>
                  </div>
                )) || (
                  <div className="text-center py-4">
                    <Building className="h-12 w-12 mx-auto text-slate-600 mb-2" />
                    <p className="text-slate-400 mb-2">
                      {isDemoMode ? "Demo mode - No real brokers" : "No brokers connected"}
                    </p>
                    <Button className="bg-transparent" variant="outline" disabled={isDemoMode && !user}>
                      {isDemoMode && !user ? "Sign up to connect brokers" : "Connect New Broker"}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Theme & Display */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Palette className="h-5 w-5 mr-2" />
                  Theme & Display
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Theme</Label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={settings.theme === "light" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("light")}
                    >
                      <Sun className="h-4 w-4 mr-1" />
                      Light
                    </Button>
                    <Button
                      variant={settings.theme === "dark" ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleThemeChange("dark")}
                    >
                      <Moon className="h-4 w-4 mr-1" />
                      Dark
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Currency</Label>
                  <Select
                    value={settings.display.currency}
                    onValueChange={(value) => handleSettingChange("display", "currency", value)}
                  >
                    <SelectTrigger className="w-24 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="JPY">JPY</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Timezone</Label>
                  <Select
                    value={settings.display.timezone}
                    onValueChange={(value) => handleSettingChange("display", "timezone", value)}
                  >
                    <SelectTrigger className="w-24 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EST">EST</SelectItem>
                      <SelectItem value="PST">PST</SelectItem>
                      <SelectItem value="GMT">GMT</SelectItem>
                      <SelectItem value="CET">CET</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Compact Mode</Label>
                  <Switch
                    checked={settings.display.compactMode}
                    onCheckedChange={(checked) => handleSettingChange("display", "compactMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Chart Preferences */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Chart Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Default Chart Type</Label>
                  <Select
                    value={settings.charts.defaultType}
                    onValueChange={(value) => handleSettingChange("charts", "defaultType", value)}
                  >
                    <SelectTrigger className="w-32 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="candlestick">Candlestick</SelectItem>
                      <SelectItem value="line">Line</SelectItem>
                      <SelectItem value="bar">Bar</SelectItem>
                      <SelectItem value="area">Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Default Timeframe</Label>
                  <Select
                    value={settings.charts.timeframe}
                    onValueChange={(value) => handleSettingChange("charts", "timeframe", value)}
                  >
                    <SelectTrigger className="w-20 bg-slate-700 border-slate-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1m">1m</SelectItem>
                      <SelectItem value="5m">5m</SelectItem>
                      <SelectItem value="15m">15m</SelectItem>
                      <SelectItem value="1h">1h</SelectItem>
                      <SelectItem value="4h">4h</SelectItem>
                      <SelectItem value="1d">1d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300 mb-2 block">Favorite Indicators</Label>
                  <div className="flex flex-wrap gap-2">
                    {["SMA", "EMA", "RSI", "MACD", "Bollinger Bands", "Volume"].map((indicator) => (
                      <Badge
                        key={indicator}
                        variant={settings.charts.indicators.includes(indicator.toLowerCase()) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const current = settings.charts.indicators
                          const updated = current.includes(indicator.toLowerCase())
                            ? current.filter((i) => i !== indicator.toLowerCase())
                            : [...current, indicator.toLowerCase()]
                          handleSettingChange("charts", "indicators", updated)
                        }}
                      >
                        {indicator}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                  {isDemoMode && !user && (
                    <Badge variant="outline" className="ml-2 text-xs border-amber-500 text-amber-500">
                      Limited in Demo
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Trading Signals</Label>
                  <Switch
                    checked={settings.notifications.signals}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "signals", checked)}
                    disabled={isDemoMode && !user}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Trade Executions</Label>
                  <Switch
                    checked={settings.notifications.trades}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "trades", checked)}
                    disabled={isDemoMode && !user}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Market News</Label>
                  <Switch
                    checked={settings.notifications.news}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "news", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">System Updates</Label>
                  <Switch
                    checked={settings.notifications.system}
                    onCheckedChange={(checked) => handleSettingChange("notifications", "system", checked)}
                  />
                </div>

                {isDemoMode && !user && (
                  <p className="text-xs text-slate-400 mt-2">Sign up to receive real-time notifications and alerts</p>
                )}
              </CardContent>
            </Card>

            {/* Trading Preferences */}
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Shield className="h-5 w-5 mr-2" />
                  Trading Preferences
                  {isDemoMode && !user && (
                    <Badge variant="outline" className="ml-2 text-xs border-amber-500 text-amber-500">
                      Demo Only
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Confirm Orders</Label>
                  <Switch
                    checked={settings.trading.confirmOrders}
                    onCheckedChange={(checked) => handleSettingChange("trading", "confirmOrders", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-slate-300">Risk Management</Label>
                  <Switch
                    checked={settings.trading.riskManagement}
                    onCheckedChange={(checked) => handleSettingChange("trading", "riskManagement", checked)}
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Default Quantity</Label>
                  <Input
                    type="number"
                    value={settings.trading.defaultQuantity}
                    onChange={(e) => handleSettingChange("trading", "defaultQuantity", Number.parseInt(e.target.value))}
                    className="bg-slate-700 border-slate-600 text-white mt-1"
                  />
                </div>

                {isDemoMode && !user && (
                  <p className="text-xs text-slate-400 mt-2">
                    Create an account to save trading preferences and connect with real brokers
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="flex space-x-4 pt-4">
              <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" disabled={isDemoMode && !user}>
                {isDemoMode && !user ? "Sign up to save settings" : "Save Settings"}
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                Reset to Default
              </Button>
            </div>

            {isDemoMode && !user && (
              <>
                <Separator className="bg-slate-700" />
                <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-700/50">
                  <CardContent className="p-4 text-center">
                    <h3 className="text-white font-semibold mb-2">Ready to get started?</h3>
                    <p className="text-slate-300 text-sm mb-4">
                      Join thousands of traders using our platform to make smarter investment decisions.
                    </p>
                    <Button
                      onClick={handleSignUp}
                      className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                    >
                      Create Free Account
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
