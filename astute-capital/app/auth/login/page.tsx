"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, ArrowLeft, LogIn, Mail, Lock, Play, TrendingUp } from "lucide-react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }))
  }

  const validateForm = () => {
    if (!formData.email.trim()) return "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Please enter a valid email"
    if (!formData.password.trim()) return "Password is required"
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Demo user for login
      const user = {
        id: "demo-user-123",
        firstName: "John",
        lastName: "Trader",
        email: formData.email,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
        brokers: [
          {
            name: "Interactive Brokers",
            accountId: "U1234567",
            balance: 25000,
            status: "connected",
          },
          {
            name: "TD Ameritrade",
            accountId: "987654321",
            balance: 15000,
            status: "connected",
          },
        ],
        preferences: {
          theme: "dark",
          notifications: true,
          newsletter: true,
        },
      }

      // Store user data
      localStorage.setItem("user", JSON.stringify(user))
      localStorage.setItem("token", "auth-token-" + Date.now())
      localStorage.setItem("demoMode", "false")

      setSuccess("Login successful! Redirecting...")

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/")
      }, 1000)
    } catch (err) {
      setError("Invalid email or password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoMode = () => {
    localStorage.setItem("demoMode", "true")
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="backdrop-blur-glass border-slate-700 shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">AstuteCapital</h1>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Welcome Back</CardTitle>
            <CardDescription className="text-slate-300">Sign in to your trading account</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {error && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="border-emerald-500/50 bg-emerald-500/10">
                <AlertDescription className="text-emerald-400">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="form-input-mobile pl-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-300">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="form-input-mobile pl-10 pr-10 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-400"
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-slate-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onCheckedChange={handleCheckboxChange}
                    className="border-slate-600"
                  />
                  <Label htmlFor="rememberMe" className="text-sm text-slate-300">
                    Remember me
                  </Label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="mobile-friendly-button w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing In...
                  </div>
                ) : (
                  <>
                    <LogIn className="h-4 w-4 mr-2" />
                    Sign In
                  </>
                )}
              </Button>
            </form>

            {/* Demo Mode */}
            <div className="text-center">
              <p className="text-slate-400 text-sm mb-2">Want to explore first?</p>
              <Button
                type="button"
                variant="outline"
                className="mobile-friendly-button w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700 bg-transparent"
                onClick={handleDemoMode}
              >
                <Play className="h-4 w-4 mr-2" />
                Try Demo Mode
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-slate-400 text-sm">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-emerald-400 hover:text-emerald-300 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
