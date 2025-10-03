"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { type User, getCurrentUser, type AuthState } from "@/lib/auth"

const AuthContext = createContext<
  AuthState & {
    setUser: (user: User | null) => void
  }
>({
  user: null,
  isAuthenticated: false,
  setUser: () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
      setIsLoading(false)
    }

    loadUser()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
