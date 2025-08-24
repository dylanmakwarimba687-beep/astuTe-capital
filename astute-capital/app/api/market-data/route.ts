import { NextResponse } from "next/server"

// Mock market data API endpoint
export async function GET() {
  try {
    // In a real application, this would fetch from actual market data providers
    // like Alpha Vantage, IEX Cloud, Polygon.io, etc.

    const mockData = {
      AAPL: {
        symbol: "AAPL",
        price: 175.43 + (Math.random() - 0.5) * 2,
        change: 2.34,
        changePercent: 1.35,
        volume: "45.2M",
        high: 177.25,
        low: 173.1,
        open: 174.5,
        timestamp: Date.now(),
        bid: 175.42,
        ask: 175.44,
        spread: 0.02,
      },
      // Add more symbols...
    }

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Market data API error:", error)
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 })
  }
}

// WebSocket endpoint for real-time data
export async function POST(request: Request) {
  try {
    const { action, symbols } = await request.json()

    if (action === "subscribe") {
      // Handle WebSocket subscription
      return NextResponse.json({ status: "subscribed", symbols })
    }

    if (action === "unsubscribe") {
      // Handle WebSocket unsubscription
      return NextResponse.json({ status: "unsubscribed", symbols })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("WebSocket API error:", error)
    return NextResponse.json({ error: "WebSocket error" }, { status: 500 })
  }
}
