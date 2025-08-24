import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { emailService } from "@/lib/email-service"

interface VerificationToken {
  email: string
  name: string
  type: string
  iat: number
  exp: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body

    if (!token) {
      return NextResponse.json({ error: "Verification token is required" }, { status: 400 })
    }

    // Verify JWT token
    let decoded: VerificationToken
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as VerificationToken
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ error: "Verification link has expired. Please request a new one." }, { status: 400 })
      }
      return NextResponse.json({ error: "Invalid verification token" }, { status: 400 })
    }

    // Validate token type
    if (decoded.type !== "email_verification") {
      return NextResponse.json({ error: "Invalid token type" }, { status: 400 })
    }

    const { email, name } = decoded

    // In production, fetch from database
    // For demo, simulate database lookup
    const existingUsers = JSON.parse(process.env.USERS_DB || "[]")
    const userIndex = existingUsers.findIndex((u: any) => u.email === email)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const user = existingUsers[userIndex]

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Verify the token matches the user's current token
    if (user.verificationToken !== token) {
      return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 })
    }

    // Update user as verified
    user.emailVerified = true
    user.emailVerifiedAt = new Date().toISOString()
    user.verificationToken = null // Clear the token

    // In production, update database
    // For demo, simulate database update
    existingUsers[userIndex] = user

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(email, name)
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError)
      // Don't fail verification if welcome email fails
    }

    // Generate auth token for immediate login
    const authToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        type: "auth",
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "7d" },
    )

    return NextResponse.json({
      success: true,
      message: "Email verified successfully! Welcome to AstuteCapital.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        emailVerified: user.emailVerified,
        emailVerifiedAt: user.emailVerifiedAt,
        createdAt: user.createdAt,
      },
      authToken,
    })
  } catch (error) {
    console.error("Email verification error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}
