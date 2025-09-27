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

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: "admin@hardwarecompany.com",
    name: "System Administrator",
    role: "admin",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "2",
    email: "director@hardwarecompany.com",
    name: "Managing Director",
    role: "managing_director",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "3",
    email: "sales@hardwarecompany.com",
    name: "Sales Officer",
    role: "sales_officer",
    createdAt: "2024-01-01",
    isActive: true,
  },
  {
    id: "4",
    email: "store@hardwarecompany.com",
    name: "Store Keeper",
    role: "storekeeper",
    createdAt: "2024-01-01",
    isActive: true,
  },
]

export const login = async (email: string, password: string): Promise<User | null> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.isActive)
  if (user && password === "password123") {
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }
  return null
}

export const logout = () => {
  localStorage.removeItem("currentUser")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null
  const stored = localStorage.getItem("currentUser")
  return stored ? JSON.parse(stored) : null
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
