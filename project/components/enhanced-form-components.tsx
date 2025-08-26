"use client"

import type React from "react"

import { useState, forwardRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: string
  loading?: boolean
  icon?: React.ReactNode
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, success, loading, icon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === "password"
    const inputType = isPassword && showPassword ? "text" : type

    return (
      <div className="space-y-2">
        {label && (
          <Label className="text-slate-300 font-medium">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </Label>
        )}
        <div className="relative">
          {icon && <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">{icon}</div>}
          <Input
            ref={ref}
            type={inputType}
            className={cn(
              "form-input-mobile bg-slate-800 border-slate-600 text-white placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/20",
              icon && "pl-10",
              isPassword && "pr-10",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500/20",
              success && "border-emerald-500 focus:border-emerald-500",
              loading && "opacity-50",
              className,
            )}
            disabled={loading}
            {...props}
          />
          {isPassword && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-white mobile-friendly-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          )}
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          )}
        </div>
        {error && (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400 text-sm">{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-emerald-500/20 bg-emerald-500/10">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <AlertDescription className="text-emerald-400 text-sm">{success}</AlertDescription>
          </Alert>
        )}
      </div>
    )
  },
)

FormInput.displayName = "FormInput"

interface FormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  success?: boolean
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const FormButton = forwardRef<HTMLButtonElement, FormButtonProps>(
  ({ className, children, loading, success, variant = "default", size = "default", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        className={cn(
          "mobile-friendly-button transition-all duration-200",
          loading && "opacity-75 cursor-not-allowed",
          success && "bg-emerald-600 hover:bg-emerald-700",
          className,
        )}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
        {success && <CheckCircle className="h-4 w-4 mr-2" />}
        {children}
      </Button>
    )
  },
)

FormButton.displayName = "FormButton"
