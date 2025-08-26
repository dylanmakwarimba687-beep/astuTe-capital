"use client"

import { useState } from "react"
import { z } from "zod"

// Validation schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const orderSchema = z
  .object({
    symbol: z.string().min(1, "Symbol is required"),
    quantity: z.number().positive("Quantity must be positive"),
    orderType: z.enum(["market", "limit", "stop", "stop-limit"]),
    price: z.number().positive().optional(),
    stopLoss: z.number().positive().optional(),
    takeProfit: z.number().positive().optional(),
  })
  .refine(
    (data) => {
      if (data.orderType !== "market" && !data.price) {
        return false
      }
      return true
    },
    {
      message: "Price is required for non-market orders",
      path: ["price"],
    },
  )

export function useFormValidation<T>(schema: z.ZodSchema<T>) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (data: any): data is T => {
    try {
      schema.parse(data)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join(".")] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const getError = (field: string) => errors[field]

  const clearErrors = () => setErrors({})

  return { validate, getError, clearErrors, hasErrors: Object.keys(errors).length > 0 }
}
