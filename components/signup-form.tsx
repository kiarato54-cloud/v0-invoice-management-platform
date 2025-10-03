"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { signup } from "@/lib/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface SignupFormProps {
  onBackToLogin: () => void
}

export function SignupForm({ onBackToLogin }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<"sales_officer" | "storekeeper">("sales_officer")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

    // Validate passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      const { user, error: signupError } = await signup(email, password, name, role)

      if (signupError) {
        setError(signupError)
        setIsLoading(false)
        return
      }

      if (!user) {
        setError("Signup failed. Please try again.")
        setIsLoading(false)
        return
      }

      setSuccess(true)
      // Redirect after a short delay
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (err) {
      console.error("[v0] Signup error:", err)
      setError("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
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
          <CardTitle className="text-2xl font-semibold">Create Account</CardTitle>
          <CardDescription>Register for Huruma Hardware Invoice System</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={role}
                onValueChange={(value) => setRole(value as "sales_officer" | "storekeeper")}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sales_officer">Sales Officer</SelectItem>
                  <SelectItem value="storekeeper">Store Keeper</SelectItem>
                  <SelectItem value="admin" disabled>
                    Admin (Contact Manager)
                  </SelectItem>
                  <SelectItem value="managing_director" disabled>
                    Managing Director (Contact Manager)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Admin and Manager roles require approval from system administrator
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password (min 6 characters)"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
              />
            </div>
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                Account created successfully! Redirecting to dashboard...
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Button variant="link" onClick={onBackToLogin} className="text-sm" disabled={isLoading}>
              Already have an account? Sign in
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
