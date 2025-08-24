import React, { useState } from 'react'
import { X, Bell, TrendingUp, TrendingDown, AlertTriangle, Info, Trash2 } from 'lucide-react'

interface NotificationsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      title: 'New Buy Signal',
      message: 'AAPL showing strong bullish momentum. Confidence: 94%',
      type: 'signal',
      priority: 'high',
      timestamp: '2 minutes ago',
      read: false,
      icon: <TrendingUp className="h-4 w-4 text-emerald-500" />,
    },
    {
      id: '2',
      title: 'Trade Executed',
      message: 'Successfully bought 100 shares of TSLA at $248.50',
      type: 'trade',
      priority: 'medium',
      timestamp: '15 minutes ago',
      read: false,
      icon: <Info className="h-4 w-4 text-blue-500" />,
    },
    {
      id: '3',
      title: 'Market Alert',
      message: 'Fed announces interest rate decision at 2:00 PM EST',
      type: 'news',
      priority: 'high',
      timestamp: '1 hour ago',
      read: true,
      icon: <AlertTriangle className="h-4 w-4 text-yellow-500" />,
    },
    {
      id: '4',
      title: 'Stop Loss Triggered',
      message: 'GOOGL position closed at $2,845. Loss: -$156.40',
      type: 'trade',
      priority: 'high',
      timestamp: '2 hours ago',
      read: false,
      icon: <TrendingDown className="h-4 w-4 text-red-500" />,
    },
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 border-b border-slate-700">
          <div className="flex space-x-2">
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
              Mark All Read
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors flex items-center">
              <Trash2 className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border transition-all ${
                notification.read 
                  ? 'bg-slate-800/50 border-slate-700' 
                  : 'bg-slate-800 border-slate-600'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">{notification.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`text-sm font-medium ${
                      notification.read ? 'text-slate-300' : 'text-white'
                    }`}>
                      {notification.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      notification.priority === 'high' ? 'bg-red-600' :
                      notification.priority === 'medium' ? 'bg-yellow-600' :
                      'bg-green-600'
                    }`}>
                      {notification.priority}
                    </span>
                  </div>
                  <p className={`text-sm ${
                    notification.read ? 'text-slate-400' : 'text-slate-300'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">{notification.timestamp}</p>
                </div>
              </div>

              {!notification.read && (
                <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-500 rounded-full"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default NotificationsPanel