"use client"

type MessageHandler = (data: any) => void
type EventType = "market_data" | "trading_signal" | "order_update" | "portfolio_update"

class WebSocketManager {
  private ws: WebSocket | null = null
  private subscribers: Map<EventType, Set<MessageHandler>> = new Map()
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private isConnecting = false
  private isDemoMode = false

  constructor() {
    // Initialize subscriber maps
    this.subscribers.set("market_data", new Set())
    this.subscribers.set("trading_signal", new Set())
    this.subscribers.set("order_update", new Set())
    this.subscribers.set("portfolio_update", new Set())
  }

  async connect(): Promise<void> {
    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      return Promise.resolve()
    }

    // Check if we're in demo mode
    if (typeof window !== "undefined") {
      this.isDemoMode = window.location.hostname === "localhost" || window.location.search.includes("demo=true")
    }

    if (this.isDemoMode) {
      return this.simulateConnection()
    }

    return new Promise((resolve, reject) => {
      this.isConnecting = true

      try {
        this.ws = new WebSocket("wss://api.tradepro.com/ws")

        this.ws.onopen = () => {
          console.log("WebSocket connected")
          this.isConnecting = false
          this.reconnectAttempts = 0
          resolve()
        }

        this.ws.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data)
            this.handleMessage(message)
          } catch (error) {
            console.error("Failed to parse WebSocket message:", error)
          }
        }

        this.ws.onerror = (error) => {
          console.error("WebSocket error:", error)
          this.isConnecting = false
          reject(error)
        }

        this.ws.onclose = () => {
          console.log("WebSocket disconnected")
          this.isConnecting = false
          this.ws = null
          this.attemptReconnect()
        }
      } catch (error) {
        this.isConnecting = false
        reject(error)
      }
    })
  }

  private async simulateConnection(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Demo WebSocket connected")
        this.startDemoDataSimulation()
        resolve()
      }, 100)
    })
  }

  private startDemoDataSimulation() {
    // Simulate market data updates
    setInterval(() => {
      const marketData = {
        AAPL: { price: 175 + Math.random() * 10, change: Math.random() * 4 - 2 },
        GOOGL: { price: 2850 + Math.random() * 50, change: Math.random() * 4 - 2 },
        TSLA: { price: 250 + Math.random() * 20, change: Math.random() * 6 - 3 },
        MSFT: { price: 380 + Math.random() * 15, change: Math.random() * 3 - 1.5 },
        NVDA: { price: 450 + Math.random() * 25, change: Math.random() * 5 - 2.5 },
      }

      this.notifySubscribers("market_data", marketData)
    }, 2000)

    // Simulate trading signals
    setInterval(() => {
      const signals = [
        { symbol: "AAPL", type: "BUY", confidence: 85, reason: "Strong earnings momentum" },
        { symbol: "TSLA", type: "SELL", confidence: 72, reason: "Overbought conditions" },
        { symbol: "NVDA", type: "BUY", confidence: 91, reason: "AI sector growth" },
      ]

      const randomSignal = signals[Math.floor(Math.random() * signals.length)]
      this.notifySubscribers("trading_signal", randomSignal)
    }, 30000)
  }

  private handleMessage(message: any) {
    if (message.type && this.subscribers.has(message.type as EventType)) {
      this.notifySubscribers(message.type as EventType, message.data)
    }
  }

  private notifySubscribers(eventType: EventType, data: any) {
    const handlers = this.subscribers.get(eventType)
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(data)
        } catch (error) {
          console.error(`Error in ${eventType} handler:`, error)
        }
      })
    }
  }

  subscribe(eventType: EventType, handler: MessageHandler): () => void {
    const handlers = this.subscribers.get(eventType)
    if (handlers) {
      handlers.add(handler)
    }

    // Return unsubscribe function
    return () => {
      const handlers = this.subscribers.get(eventType)
      if (handlers) {
        handlers.delete(handler)
      }
    }
  }

  private attemptReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached")
      return
    }

    this.reconnectAttempts++
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)

    setTimeout(() => {
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)
      this.connect().catch((error) => {
        console.error("Reconnection failed:", error)
      })
    }, delay)
  }

  disconnect() {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.reconnectAttempts = 0
  }

  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else if (this.isDemoMode) {
      console.log("Demo mode: Message would be sent:", message)
    }
  }
}

export const wsManager = new WebSocketManager()
