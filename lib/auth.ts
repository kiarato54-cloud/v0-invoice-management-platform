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
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user.id)
    .single()

  if (userError || !userData) {
    console.error("[v0] User data fetch error:", userError?.message || "Unknown error")
    
    // ✅ Create user profile if it doesn't exist
    const { data: newUserData } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || data.user.email,
          role: data.user.user_metadata?.role || "sales_officer",
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ])
      .select()
      .single()

    if (!newUserData) {
      return null
    }

    return {
      id: newUserData.id,
      email: newUserData.email,
      name: newUserData.name,
      role: newUserData.role,
      createdAt: newUserData.created_at,
      isActive: newUserData.is_active,
    }
  }

  const user: User = {
    id: userData.id,
    email: userData.email,
    name: userData.name || userData.full_name || userData.email,
    role: userData.role,
    createdAt: userData.created_at,
    isActive: userData.is_active ?? true,
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

  // Sign up the user with Supabase Auth
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

  // Wait a moment for any database trigger to create the profile
  await new Promise((resolve) => setTimeout(resolve, 2000))

  try {
    // Try to insert the user profile, but handle duplicate key errors
    const { data: userData, error: profileError } = await supabase
      .from("users")
      .insert([
        {
          id: data.user.id,
          email: email,
          name: name,
          role: role,
          created_at: new Date().toISOString(),
          is_active: true,
        },
      ])
      .select()
      .single()

    // If it's a duplicate key error, just fetch the existing user
    if (profileError && profileError.code === '23505') {
      console.log("[v0] User profile already exists, fetching...")
      const { data: existingUser } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (existingUser) {
        const user: User = {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
          createdAt: existingUser.created_at,
          isActive: existingUser.is_active,
        }
        return { user, error: null }
      }
    }

    if (profileError && profileError.code !== '23505') {
      console.error("[v0] User profile creation error:", profileError.message)
      return { user: null, error: `Profile creation failed: ${profileError.message}` }
    }

    // If insert was successful
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      createdAt: userData.created_at,
      isActive: userData.is_active,
    }

    return { user, error: null }

  } catch (err) {
    console.error("[v0] Unexpected error during signup:", err)
    return { user: null, error: "Unexpected error during signup" }
  }
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
