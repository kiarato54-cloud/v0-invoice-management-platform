import { useState, useEffect } from 'react'
import { Customer, getCustomers } from '@/lib/invoice-data'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const data = await getCustomers()
        setCustomers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch customers')
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  return { customers, loading, error }
}
