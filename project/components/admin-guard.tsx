"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"

interface AdminGuardProps {
  children: React.ReactNode
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isDemoMode, user } = useAppStore()
  const router = useRouter()

  useEffect(() => {
    if (isDemoMode) return
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    const role = (user as any)?.preferences?.role
    if (role !== "admin") {
      router.push("/")
    }
  }, [isAuthenticated, isDemoMode, user, router])

  if (!isAuthenticated && !isDemoMode) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return <>{children}</>
}