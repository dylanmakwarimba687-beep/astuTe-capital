"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Settings, Bell, Filter, TrendingUp } from "lucide-react"

interface PremiumSignalCustomizationProps {
  isOpen: boolean
  onClose: () => void
  isPremium: boolean
}

export function PremiumSignalCustomization({ isOpen, onClose, isPremium }: PremiumSignalCustomizationProps) {
  const [minConfidence, setMinConfidence] = useState([75])
  const [categories, setCategories] = useState({
    forex: true,
    crypto: true,
    stocks: false,
    commodities: false,
  })
  const [priorities, setPriorities] = useState({
    high: true,
    medium: true,
    low: false,
  })
  const [notifications, setNotifications] = useState({
    push: true,
    email: false,
    sms: false,
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-emerald-400" />
                Signal Customization
              </CardTitle>
              <CardDescription className="text-slate-400">
                Customize your trading signals and notifications
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="filters" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-700">
              <TabsTrigger value="filters" className="data-[state=active]:bg-emerald-600">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-600">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="advanced" className="data-[state=active]:bg-emerald-600">
                <TrendingUp className="w-4 h-4 mr-2" />
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="filters" className="space-y-6">
              {/* Confidence Level */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Minimum Confidence Level</h3>
                  <p className="text-sm text-slate-400 mb-4">Only show signals with confidence above this threshold</p>
                </div>
                <div className="space-y-4">
                  <Slider
                    value={minConfidence}
                    onValueChange={setMinConfidence}
                    max={100}
                    min={50}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-slate-400">
                    <span>50%</span>
                    <span className="text-emerald-400 font-semibold">{minConfidence[0]}%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Market Categories</h3>
                  <p className="text-sm text-slate-400 mb-4">Select which markets to receive signals from</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(categories).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${value ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-600 text-slate-400"}`}
                        >
                          {key.toUpperCase()}
                        </Badge>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setCategories((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority Levels */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Priority Levels</h3>
                  <p className="text-sm text-slate-400 mb-4">Choose which priority signals to receive</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(priorities).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Badge
                          className={`${
                            key === "high"
                              ? "bg-red-500/20 text-red-400"
                              : key === "medium"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {key.toUpperCase()}
                        </Badge>
                        <span className="text-white capitalize">{key} Priority</span>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setPriorities((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Notification Methods</h3>
                  <p className="text-sm text-slate-400 mb-4">Choose how you want to receive signal alerts</p>
                </div>
                <div className="space-y-3">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                      <div>
                        <span className="text-white capitalize font-medium">{key} Notifications</span>
                        <p className="text-sm text-slate-400">
                          {key === "push" && "Browser push notifications"}
                          {key === "email" && "Email alerts to your inbox"}
                          {key === "sms" && "SMS text messages"}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => setNotifications((prev) => ({ ...prev, [key]: checked }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Advanced Settings</h3>
                  <p className="text-sm text-slate-400 mb-4">Fine-tune your signal preferences</p>
                </div>

                {!isPremium && (
                  <Card className="bg-gradient-to-r from-emerald-900/30 to-blue-900/30 border-emerald-500/30">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h4 className="text-white font-semibold mb-2">Premium Feature</h4>
                        <p className="text-slate-300 text-sm mb-4">
                          Upgrade to Premium to access advanced customization options
                        </p>
                        <Button className="bg-emerald-600 hover:bg-emerald-700">Upgrade to Premium</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isPremium && (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Auto-Execute Trades</h4>
                      <p className="text-sm text-slate-400 mb-3">Automatically execute trades based on signals</p>
                      <Switch />
                    </div>

                    <div className="p-4 bg-slate-700/50 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Risk Management</h4>
                      <p className="text-sm text-slate-400 mb-3">Set maximum position size and daily loss limits</p>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm text-slate-400">Max Position Size (%)</label>
                          <Slider defaultValue={[5]} max={20} min={1} step={1} className="mt-2" />
                        </div>
                        <div>
                          <label className="text-sm text-slate-400">Daily Loss Limit (%)</label>
                          <Slider defaultValue={[10]} max={50} min={5} step={5} className="mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-700">
            <Button variant="outline" onClick={onClose} className="border-slate-600 text-slate-300 bg-transparent">
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
