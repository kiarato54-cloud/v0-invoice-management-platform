"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { login } from "@/lib/auth"
import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { SignupForm } from "./signup-form"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [showSignup, setShowSignup] = useState(false)
  const { setUser } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const user = await login(email, password)
      if (user) {
        setUser(user)
        router.push("/dashboard")
      } else {
        setError("Invalid credentials. Please check your email and password.")
      }
    } catch (err) {
      setError("Login failed. Please try again.")
      console.error("[v0] Login error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  if (showSignup) {
    return <SignupForm onBackToLogin={() => setShowSignup(false)} />
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 relative">
            <Image
              src="/images/huruma-hardware-logo.jpg"
              alt="Huruma Hardware Company Logo"
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-semibold">Huruma Hardware Company</CardTitle>
          <CardDescription>Invoice Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={() => setShowSignup(true)} className="text-sm">
              Don't have an account? Sign up
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
