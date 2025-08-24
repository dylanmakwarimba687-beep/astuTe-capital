import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { emailService } from "@/lib/email-service"

interface ResendRequest {
  email: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ResendRequest = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // In production, fetch from database
    // For demo, simulate database lookup
    const existingUsers = JSON.parse(process.env.USERS_DB || "[]")
    const user = existingUsers.find((u: any) => u.email === normalizedEmail)

    if (!user) {
      return NextResponse.json({ error: "No account found with this email address" }, { status: 404 })
    }

    if (user.emailVerified) {
      return NextResponse.json({ error: "Email is already verified" }, { status: 400 })
    }

    // Check rate limiting (prevent spam)
    const lastSent = new Date(user.lastVerificationSent || 0)
    const now = new Date()
    const timeDiff = now.getTime() - lastSent.getTime()
    const cooldownPeriod = 60 * 1000 // 1 minute cooldown

    if (timeDiff < cooldownPeriod) {
      const remainingTime = Math.ceil((cooldownPeriod - timeDiff) / 1000)
      return NextResponse.json(
        { error: `Please wait ${remainingTime} seconds before requesting another email` },
        { status: 429 },
      )
    }

    // Generate new verification token
    const verificationToken = jwt.sign(
      {
        email: normalizedEmail,
        name: user.name,
        type: "email_verification",
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    // Update user with new token and timestamp
    user.verificationToken = verificationToken
    user.lastVerificationSent = now.toISOString()

    // In production, update database
    // For demo, simulate database update

    // Create verification URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}`

    // Send verification email
    try {
      await emailService.sendVerificationEmail(normalizedEmail, user.name, verificationUrl)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      return NextResponse.json({ error: "Failed to send verification email. Please try again later." }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "Verification email sent successfully. Please check your inbox.",
    })
  } catch (error) {
    console.error("Resend verification error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}
