import { type NextRequest, NextResponse } from "next/server"
import { hash } from "bcryptjs"
import jwt from "jsonwebtoken"
import { emailService } from "@/lib/email-service"

interface SignupRequest {
  name: string
  email: string
  password: string
  subscribeNewsletter?: boolean
}

export async function POST(request: NextRequest) {
  try {
    const body: SignupRequest = await request.json()
    const { name, email, password, subscribeNewsletter = false } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address" }, { status: 400 })
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters long" }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()
    const trimmedName = name.trim()

    // Check if user already exists (in production, check database)
    const existingUsers = JSON.parse(process.env.USERS_DB || "[]")
    const userExists = existingUsers.some((user: any) => user.email === normalizedEmail)

    if (userExists) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Generate verification token
    const verificationToken = jwt.sign(
      {
        email: normalizedEmail,
        name: trimmedName,
        type: "email_verification",
      },
      process.env.JWT_SECRET || "fallback-secret",
      { expiresIn: "24h" },
    )

    // Create user object
    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: trimmedName,
      email: normalizedEmail,
      password: hashedPassword,
      emailVerified: false,
      subscribeNewsletter,
      createdAt: new Date().toISOString(),
      verificationToken,
      lastVerificationSent: new Date().toISOString(),
    }

    // In production, save to database
    // For demo, we'll simulate database storage
    const updatedUsers = [...existingUsers, newUser]

    // Create verification URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const verificationUrl = `${baseUrl}/auth/verify?token=${verificationToken}`

    // Send verification email
    try {
      await emailService.sendVerificationEmail(normalizedEmail, trimmedName, verificationUrl)
    } catch (emailError) {
      console.error("Failed to send verification email:", emailError)
      // Don't fail the signup if email fails - user can resend
    }

    // Return success response (don't include sensitive data)
    return NextResponse.json(
      {
        success: true,
        message: "Account created successfully. Please check your email to verify your account.",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          emailVerified: newUser.emailVerified,
          createdAt: newUser.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error. Please try again later." }, { status: 500 })
  }
}
