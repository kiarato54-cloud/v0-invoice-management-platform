import type { User } from "./auth"

// Extended user data for management
export interface UserWithStats extends User {
  lastLogin?: string
  invoiceCount: number
  totalRevenue: number
  status: "active" | "inactive" | "suspended"
}

// Mock users with additional data
const mockUsersWithStats: UserWithStats[] = [
  {
    id: "1",
    email: "admin@hardwarecompany.com",
    name: "System Administrator",
    role: "admin",
    createdAt: "2024-01-01",
    isActive: true,
    lastLogin: "2024-01-20",
    invoiceCount: 0,
    totalRevenue: 0,
    status: "active",
  },
  {
    id: "2",
    email: "director@hardwarecompany.com",
    name: "Managing Director",
    role: "managing_director",
    createdAt: "2024-01-01",
    isActive: true,
    lastLogin: "2024-01-19",
    invoiceCount: 0,
    totalRevenue: 0,
    status: "active",
  },
  {
    id: "3",
    email: "sales@hardwarecompany.com",
    name: "Sales Officer",
    role: "sales_officer",
    createdAt: "2024-01-01",
    isActive: true,
    lastLogin: "2024-01-20",
    invoiceCount: 1,
    totalRevenue: 302.5,
    status: "active",
  },
  {
    id: "4",
    email: "store@hardwarecompany.com",
    name: "Store Keeper",
    role: "storekeeper",
    createdAt: "2024-01-01",
    isActive: true,
    lastLogin: "2024-01-18",
    invoiceCount: 0,
    totalRevenue: 0,
    status: "active",
  },
]

export const getUsers = (): UserWithStats[] => {
  const stored = localStorage.getItem("users")
  return stored ? JSON.parse(stored) : mockUsersWithStats
}

export const saveUser = (user: UserWithStats): void => {
  const users = getUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)

  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }

  localStorage.setItem("users", JSON.stringify(users))
}

export const deleteUser = (userId: string): void => {
  const users = getUsers().filter((user) => user.id !== userId)
  localStorage.setItem("users", JSON.stringify(users))
}

export const createUser = (
  userData: Omit<UserWithStats, "id" | "createdAt" | "invoiceCount" | "totalRevenue">,
): UserWithStats => {
  const newUser: UserWithStats = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split("T")[0],
    invoiceCount: 0,
    totalRevenue: 0,
  }

  saveUser(newUser)
  return newUser
}
