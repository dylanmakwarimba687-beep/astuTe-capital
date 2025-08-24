import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // In a real app, fetch user from database
    const user = {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      brokers: [],
      preferences: {
        theme: "dark",
        notifications: true,
        charts: ["candlestick", "line"],
        currency: "USD",
      },
      role: decoded.role || "user",
    }

    return NextResponse.json({ user, valid: true })
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
