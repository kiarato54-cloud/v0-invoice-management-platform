"use client"

import { usePOSProducts } from "@/lib/hooks/usePOSProducts"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface POSProductListProps {
  onSelectProduct: (product: any) => void
}

export function POSProductList({ onSelectProduct }: POSProductListProps) {
  const { products, loading } = usePOSProducts()
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = Array.from(new Set(products.map((p) => p.category)))
  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || p.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Input
          placeholder="Search by product name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!selectedCategory ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All Categories
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
        {loading ? (
          Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center py-8 text-muted-foreground">No products found</div>
        ) : (
          filtered.map((product) => (
            <Button
              key={product.id}
              variant="outline"
              className="h-auto p-3 text-left flex-col items-start bg-transparent"
              onClick={() => onSelectProduct(product)}
            >
              <div className="font-semibold text-sm line-clamp-2">{product.name}</div>
              <div className="text-xs text-muted-foreground">{product.sku}</div>
              <div className="text-sm font-bold text-primary mt-2">Ksh {product.unit_price.toFixed(2)}</div>
            </Button>
          ))
        )}
      </div>
    </div>
  )
}
