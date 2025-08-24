import { type NextRequest, NextResponse } from "next/server"

// Mock orders database
const orders: any[] = [
  {
    id: "1",
    symbol: "AAPL",
    type: "BUY",
    quantity: 100,
    price: 175.5,
    status: "FILLED",
    timestamp: new Date().toISOString(),
  },
  {
    id: "2",
    symbol: "TSLA",
    type: "SELL",
    quantity: 50,
    price: 248.2,
    status: "PENDING",
    timestamp: new Date().toISOString(),
  },
]

export async function GET() {
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    const newOrder = {
      id: Date.now().toString(),
      ...orderData,
      status: "PENDING",
      timestamp: new Date().toISOString(),
    }

    orders.unshift(newOrder)

    // Simulate order processing
    setTimeout(() => {
      const orderIndex = orders.findIndex((o) => o.id === newOrder.id)
      if (orderIndex !== -1) {
        orders[orderIndex].status = Math.random() > 0.1 ? "FILLED" : "REJECTED"
      }
    }, 2000)

    return NextResponse.json(newOrder)
  } catch (error) {
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 })
  }
}
