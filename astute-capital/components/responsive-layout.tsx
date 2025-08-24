"use client"

import type React from "react"

import { useEffect, useState } from "react"

interface ResponsiveLayoutProps {
  children: React.ReactNode
}

export default function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return <div className={`min-h-screen bg-slate-950 ${isMobile ? "mobile-layout" : "desktop-layout"}`}>{children}</div>
}
