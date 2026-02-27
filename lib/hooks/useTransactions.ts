"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface POSTransaction {
  id: string
  transaction_number: string
  branch_id: string
  cashier_id: string
  customer_id?: string
  subtotal: number
  tax_amount: number
  tax_rate: number
  discount_amount: number
  total_amount: number
  payment_method?: string
  payment_reference?: string
  status: "pending" | "completed" | "cancelled" | "refunded"
  notes?: string
  created_at: string
  updated_at: string
}

export function useTransactions(branchId?: string) {
  const [transactions, setTransactions] = useState<POSTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      let query = supabase.from("pos_transactions").select("*").order("created_at", { ascending: false })

      if (branchId) {
        query = query.eq("branch_id", branchId)
      }

      const { data, error: err } = await query

      if (err) throw err
      setTransactions(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch transactions")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [branchId])

  return { transactions, loading, error, refetch: fetchTransactions }
}
