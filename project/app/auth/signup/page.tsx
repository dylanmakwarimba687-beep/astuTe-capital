"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  Eye,
  EyeOff,
  Mail,
  User,
  Lock,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FormData {
  name: string
  email: string
  password: string
  confirmPassword: string
  agreeToTerms: boolean
  subscribeNewsletter: boolean
}

interface FormErrors {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
  agreeToTerms?: string
  submit?: string
}

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribeNewsletter: true,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validatePassword = (password: string) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    }
    return requirements
  }

  const passwordRequirements = validatePassword(formData.password)
  const isPasswordValid = Object.values(passwordRequirements).every(Boolean)

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (!isPasswordValid) {
      newErrors.password = "Password does not meet requirements"
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms and conditions"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          password: formData.password,
          subscribeNewsletter: formData.subscribeNewsletter,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create account")
      }

      setIsSuccess(true)

      // Redirect to verification page after 2 seconds
      setTimeout(() => {
        router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`)
      }, 2000)
    } catch (error) {
      setErrors({
        submit: error instanceof Error ? error.message : "An unexpected error occurred",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <CardTitle className="text-2xl text-white">Check Your Email!</CardTitle>
            <CardDescription className="text-slate-300">
              We've sent a verification link to <strong>{formData.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-slate-400 mb-4">
              Click the link in your email to verify your account and start trading with AstuteCapital.
            </p>
            <p className="text-xs text-slate-500">
              Didn't receive the email? Check your spam folder or contact support.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AstuteCapital</h1>
            </div>
            <div className="flex justify-center mb-4">
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                Premium Trading Platform
              </Badge>
            </div>
            <CardTitle className="text-2xl text-white">Create Your Account</CardTitle>
            <CardDescription className="text-slate-300">
              Join thousands of successful traders using AI-powered insights
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.submit && (
                <Alert className="border-red-500/50 bg-red-500/10">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">{errors.submit}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 form-input-mobile"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 form-input-mobile"
                  />
                </div>
                {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 form-input-mobile"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {formData.password && (
                  <div className="space-y-1 text-xs">
                    <div
                      className={`flex items-center gap-2 ${passwordRequirements.length ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {passwordRequirements.length ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      At least 8 characters
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRequirements.uppercase ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {passwordRequirements.uppercase ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      One uppercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRequirements.lowercase ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {passwordRequirements.lowercase ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      One lowercase letter
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRequirements.number ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {passwordRequirements.number ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      One number
                    </div>
                    <div
                      className={`flex items-center gap-2 ${passwordRequirements.special ? "text-emerald-400" : "text-slate-400"}`}
                    >
                      {passwordRequirements.special ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      One special character
                    </div>
                  </div>
                )}

                {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-slate-300">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    className="pl-10 pr-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 form-input-mobile"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) => handleInputChange("agreeToTerms", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="agreeToTerms" className="text-sm text-slate-300 leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                {errors.agreeToTerms && <p className="text-sm text-red-400">{errors.agreeToTerms}</p>}

                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="subscribeNewsletter"
                    checked={formData.subscribeNewsletter}
                    onCheckedChange={(checked) => handleInputChange("subscribeNewsletter", checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="subscribeNewsletter" className="text-sm text-slate-300 leading-relaxed">
                    Subscribe to our newsletter for exclusive trading insights and market analysis
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white mobile-friendly-button"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              {/* Features Preview */}
              <div className="mt-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <h3 className="text-white font-semibold mb-3 text-center">🚀 What you'll get:</h3>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-slate-300">
                    <TrendingUp className="h-4 w-4 text-emerald-400 mr-2" />
                    AI-powered trading signals with 89% accuracy
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Shield className="h-4 w-4 text-emerald-400 mr-2" />
                    Advanced risk management and portfolio optimization
                  </div>
                  <div className="flex items-center text-sm text-slate-300">
                    <Zap className="h-4 w-4 text-emerald-400 mr-2" />
                    Real-time market analysis and trend predictions
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link href="/auth/login" className="text-emerald-400 hover:text-emerald-300 underline">
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="text-center pt-4 border-t border-slate-700">
                <Link href="/signals?demo=true">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                  >
                    Try Demo Mode Instead
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
