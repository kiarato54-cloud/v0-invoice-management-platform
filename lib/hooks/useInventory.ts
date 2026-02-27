"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface InventoryItem {
  id: string
  product_id: string
  branch_id: string
  quantity_on_hand: number
  reorder_level: number
  reorder_quantity: number
  last_stock_count?: string
  product_name?: string
  sku?: string
  unit_price?: number
}

export function useInventory(branchId?: string) {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from("inventory").select(`
          id,
          product_id,
          branch_id,
          quantity_on_hand,
          reorder_level,
          reorder_quantity,
          last_stock_count,
          products!inner(name, sku, unit_price)
        `)

      if (branchId) {
        query = query.eq("branch_id", branchId)
      }

      const { data, error: err } = await query

      if (err) throw err

      const items = (data || []).map((item: any) => ({
        ...item,
        product_name: item.products?.name,
        sku: item.products?.sku,
        unit_price: item.products?.unit_price,
      }))

      setInventory(items)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch inventory")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInventory()
  }, [branchId])

  return { inventory, loading, error, refetch: fetchInventory }
}
