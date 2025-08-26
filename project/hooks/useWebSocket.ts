"use client"

import { useEffect, useRef, useState } from "react"

interface WebSocketMessage {
  type: string
  data: any
}

interface UseWebSocketOptions {
  url?: string
  onMessage?: (data: any) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const ws = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout>()

  const connect = () => {
    try {
      // For demo mode, simulate connection without actual WebSocket
      if (typeof window !== "undefined" && window.location.hostname === "localhost") {
        // Simulate successful connection
        setTimeout(() => {
          setIsConnected(true)
          setError(null)
          options.onOpen?.()
        }, 100)
        return
      }

      const websocketUrl = options.url || "wss://api.tradepro.com/ws"
      ws.current = new WebSocket(websocketUrl)

      ws.current.onopen = () => {
        setIsConnected(true)
        setError(null)
        options.onOpen?.()
      }

      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data)
          options.onMessage?.(message)
        } catch (err) {
          console.error("Failed to parse WebSocket message:", err)
        }
      }

      ws.current.onerror = (event) => {
        setError("WebSocket connection error")
        options.onError?.(event)
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        options.onClose?.()

        // Attempt to reconnect after 3 seconds
        reconnectTimeoutRef.current = setTimeout(() => {
          connect()
        }, 3000)
      }
    } catch (err) {
      setError("Failed to establish WebSocket connection")
      console.error("WebSocket connection error:", err)
    }
  }

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
    }
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    setIsConnected(false)
  }

  const sendMessage = (message: any) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message))
    }
  }

  useEffect(() => {
    return () => {
      disconnect()
    }
  }, [])

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
  }
}
