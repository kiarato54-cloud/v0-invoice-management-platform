"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

export interface Branch {
  id: string
  name: string
  location: string
  phone?: string
  email?: string
  manager_id?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error: err } = await supabase.from("branches").select("*").eq("is_active", true).order("name")

      if (err) throw err
      setBranches(data || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch branches")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBranches()
  }, [])

  return { branches, loading, error, refetch: fetchBranches }
}
