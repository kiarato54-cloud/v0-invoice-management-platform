"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Product {
  id: string
  name: string
  sku: string
  barcode?: string
  category: string
  description?: string
  unit_price: number
  cost_price?: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export function usePOSProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error: err } = await supabase.from("products").select("*").eq("is_active", true).order("name")

      if (err) throw err
      setProducts(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch products")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, loading, error, refetch: fetchProducts }
}
