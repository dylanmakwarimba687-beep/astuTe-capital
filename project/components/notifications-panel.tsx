"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bell, X, TrendingUp, TrendingDown, AlertTriangle, Info, Trash2 } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "signal" | "trade" | "news" | "system"
  priority: "high" | "medium" | "low"
  timestamp: string
  read: boolean
  icon: React.ReactNode
}

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "New Buy Signal",
      message: "AAPL showing strong bullish momentum. Confidence: 94%",
      type: "signal",
      priority: "high",
      timestamp: "2 minutes ago",
      read: false,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: "2",
      title: "Trade Executed",
      message: "Successfully bought 100 shares of TSLA at $248.50",
      type: "trade",
      priority: "medium",
      timestamp: "15 minutes ago",
      read: false,
      icon: <Info className="h-4 w-4 text-blue-500" />,
    },
    {
      id: "3",
      title: "Market Alert",
      message: "Fed announces interest rate decision at 2:00 PM EST",
      type: "news",
      priority: "high",
      timestamp: "1 hour ago",
      read: true,
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    },
    {
      id: "4",
      title: "Stop Loss Triggered",
      message: "GOOGL position closed at $2,845. Loss: -$156.40",
      type: "trade",
      priority: "high",
      timestamp: "2 hours ago",
      read: false,
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    },
    {
      id: "5",
      title: "System Maintenance",
      message: "Scheduled maintenance tonight from 12:00 AM - 2:00 AM EST",
      type: "system",
      priority: "low",
      timestamp: "3 hours ago",
      read: true,
      icon: <Info className="h-4 w-4 text-slate-400" />,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && <Badge className="bg-emerald-500 text-white">{unreadCount}</Badge>}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={markAllAsRead}>
              Mark All Read
            </Button>
            <Button size="sm" variant="outline" onClick={clearAllNotifications}>
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 mx-auto text-slate-600 mb-4" />
                <p className="text-slate-400">No notifications</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative group p-4 rounded-lg border transition-all duration-200 ${
                    notification.read ? "bg-slate-800/50 border-slate-700" : "bg-slate-800 border-slate-600"
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium ${notification.read ? "text-slate-300" : "text-white"}`}>
                          {notification.title}
                        </h3>
                        <Badge
                          variant={
                            notification.priority === "high"
                              ? "destructive"
                              : notification.priority === "medium"
                                ? "default"
                                : "secondary"
                          }
                          className="text-xs"
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className={`text-sm ${notification.read ? "text-slate-400" : "text-slate-300"}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                    </div>
                  </div>

                  {/* Swipe to delete indicator */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeNotification(notification.id)
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  {!notification.read && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
