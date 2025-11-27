"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useMemo } from "react"
import Link from "next/link"

interface Product {
  id: string
  name: string
  sku: string
  category: string
  unitPrice: number
  costPrice?: number
  isActive: boolean
}

// Mock products - in real app, this would come from database
const mockProducts: Product[] = [
  {
    id: "1",
    name: "Cement 50kg",
    sku: "CMT-001",
    category: "Building Materials",
    unitPrice: 12000,
    costPrice: 10000,
    isActive: true,
  },
  {
    id: "2",
    name: "Iron Sheets",
    sku: "IRS-001",
    category: "Roofing",
    unitPrice: 45000,
    costPrice: 38000,
    isActive: true,
  },
  {
    id: "3",
    name: "Wooden Planks",
    sku: "WDP-001",
    category: "Lumber",
    unitPrice: 5000,
    costPrice: 3500,
    isActive: true,
  },
]

export default function ProductsPage() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [searchTerm, selectedCategory])

  const categories = ["all", ...new Set(mockProducts.map((p) => p.category))]

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Products Catalog</h1>
            <p className="text-muted-foreground mt-1">Manage product inventory and pricing</p>
          </div>
          <Link href="/dashboard/pos/products/new">
            <Button>
              <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Button>
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-input border border-border"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-md bg-input border border-border"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
                  </div>
                  <span className="px-2 py-1 bg-secondary/50 rounded-md text-xs font-medium">{product.category}</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Unit Price</p>
                    <p className="text-lg font-bold">Tshs {product.unitPrice.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Cost Price</p>
                    <p className="text-lg font-bold">Tshs {product.costPrice?.toLocaleString() || "N/A"}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Stock
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No products found matching your search</p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
