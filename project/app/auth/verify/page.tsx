"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2, Mail, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"

function VerifyEmailContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [isResending, setIsResending] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [countdown, setCountdown] = useState(0)

  const token = searchParams.get("token")
  const email = searchParams.get("email")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus("error")
      setMessage("Invalid verification link. Please check your email for the correct link.")
    }
  }, [token])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else if (countdown === 0 && !canResend) {
      setCanResend(true)
    }
    return () => clearInterval(interval)
  }, [countdown, canResend])

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus("success")
        setMessage(data.message || "Email verified successfully!")

        // Store auth token if provided
        if (data.authToken) {
          localStorage.setItem("authToken", data.authToken)
          localStorage.setItem("user", JSON.stringify(data.user))
        }

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/")
        }, 3000)
      } else {
        setStatus("error")
        setMessage(data.error || "Verification failed. Please try again.")
      }
    } catch (error) {
      setStatus("error")
      setMessage("Network error. Please check your connection and try again.")
    }
  }

  const handleResendEmail = async () => {
    if (!email || !canResend) return

    setIsResending(true)
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.")
        setCanResend(false)
        setCountdown(60) // 60 second cooldown
      } else {
        setMessage(data.error || "Failed to resend email. Please try again.")
      }
    } catch (error) {
      setMessage("Network error. Please try again.")
    } finally {
      setIsResending(false)
    }
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
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              {status === "loading" && (
                <div className="bg-blue-500/20 w-full h-full rounded-full flex items-center justify-center">
                  <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="bg-emerald-500/20 w-full h-full rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-500/20 w-full h-full rounded-full flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" />
                </div>
              )}
            </div>

            <CardTitle className="text-2xl text-white">
              {status === "loading" && "Verifying Your Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>

            <CardDescription className="text-slate-300">
              {status === "loading" && "Please wait while we verify your email address"}
              {status === "success" && "Welcome to AstuteCapital! Your account is now active."}
              {status === "error" && "We couldn't verify your email address"}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert
                className={`${
                  status === "success"
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : status === "error"
                      ? "border-red-500/50 bg-red-500/10"
                      : "border-blue-500/50 bg-blue-500/10"
                }`}
              >
                <AlertDescription
                  className={`${
                    status === "success" ? "text-emerald-400" : status === "error" ? "text-red-400" : "text-blue-400"
                  }`}
                >
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-slate-400 mb-4">Redirecting you to your dashboard in 3 seconds...</p>
                  <Button
                    onClick={() => router.push("/")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Go to Dashboard Now
                  </Button>
                </div>

                <div className="bg-slate-700/30 p-4 rounded-lg border border-slate-600">
                  <h3 className="text-white font-semibold mb-2">🎉 What's Next?</h3>
                  <ul className="text-sm text-slate-300 space-y-1">
                    <li>• Access premium trading signals</li>
                    <li>• Set up your trading preferences</li>
                    <li>• Connect your broker accounts</li>
                    <li>• Join our trader community</li>
                  </ul>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-4">
                {email && (
                  <div className="text-center">
                    <p className="text-sm text-slate-400 mb-4">Need a new verification link?</p>
                    <Button
                      onClick={handleResendEmail}
                      disabled={isResending || !canResend}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      {isResending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : !canResend ? (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend in {countdown}s
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Verification Email
                        </>
                      )}
                    </Button>
                  </div>
                )}

                <div className="text-center">
                  <p className="text-xs text-slate-500 mb-4">Still having trouble? Contact our support team.</p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => router.push("/auth/signup")}
                      variant="outline"
                      className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
                    >
                      Create New Account
                    </Button>
                    <Button
                      onClick={() => router.push("/auth/login")}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      Sign In Instead
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center">
                <p className="text-sm text-slate-400">This may take a few moments...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-4" />
            <p className="text-slate-300">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  )
}
