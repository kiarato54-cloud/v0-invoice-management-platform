import { createClient } from "./supabase/client"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "managing_director" | "sales_officer" | "storekeeper"
  createdAt: string
  isActive: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

export const login = async (email: string, password: string): Promise<User | null> => {
  const supabase = createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error || !data.user) {
    console.error("[v0] Login error:", error?.message || "Unknown error")
    return null
  }

  // Fetch user profile from users table
  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  if (userError || !userData) {
    console.error("[v0] User data fetch error:", userError?.message || "Unknown error")
    return null
  }

  const user: User = {
    id: userData.id,
    email: userData.email,
    name: userData.name || userData.full_name || userData.email,
    role: userData.role,
    createdAt: userData.created_at,
    isActive: userData.is_active ?? true, // Use nullish coalescing for safety
  }

  return user
}

export const signup = async (
  email: string,
  password: string,
  name: string,
  role: "sales_officer" | "storekeeper",
): Promise<{ user: User | null; error: string | null }> => {
  const supabase = createClient()

  // Sign up the user with Supabase Auth - the trigger will create the profile automatically
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
      data: {
        name,
        role,
      },
    },
  })

  if (error) {
    console.error("[v0] Signup error:", error.message)
    return { user: null, error: error.message }
  }

  if (!data.user) {
    return { user: null, error: "Signup failed - no user returned" }
  }

  // Wait a moment for the trigger to create the profile
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Fetch the created user profile
  const { data: userData, error: fetchError } = await supabase.from("users").select("*").eq("id", data.user.id).single()

  if (fetchError || !userData) {
    console.error("[v0] User profile fetch error:", fetchError?.message)
    // User was created in auth but profile fetch failed - they can still login
    return {
      user: {
        id: data.user.id,
        email: email,
        name: name,
        role: role,
        createdAt: new Date().toISOString(),
        isActive: true,
      },
      error: null,
    }
  }

  const user: User = {
    id: userData.id,
    email: userData.email,
    name: userData.name || userData.full_name || email,
    role: userData.role,
    createdAt: userData.created_at,
    isActive: userData.is_active ?? true,
  }

  return { user, error: null }
}

export const logout = async () => {
  const supabase = createClient()
  await supabase.auth.signOut()
}

export const getCurrentUser = async (): Promise<User | null> => {
  const supabase = createClient()

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return null

  const { data: userData, error } = await supabase.from("users").select("*").eq("id", authUser.id).single()

  if (error || !userData) {
    console.error("[v0] Get current user error:", error?.message)
    return null
  }

  return {
    id: userData.id,
    email: userData.email,
    name: userData.name || userData.full_name || userData.email,
    role: userData.role,
    createdAt: userData.created_at,
    isActive: userData.is_active ?? true, // Use nullish coalescing for safety
  }
}

export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false

  const permissions = {
    admin: ["all"],
    managing_director: ["view_all_invoices", "view_reports", "manage_users"],
    sales_officer: ["create_invoice", "view_own_invoices", "edit_own_invoices"],
    storekeeper: ["view_invoices", "update_inventory"],
  }

  const userPermissions = permissions[user.role] || []
  return userPermissions.includes("all") || userPermissions.includes(permission)
}
