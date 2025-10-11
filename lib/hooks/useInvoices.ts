// /lib/hooks/useInvoices.ts
import { useState, useEffect } from 'react'
import { Invoice, getInvoices } from '@/lib/invoice-data'

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const data = await getInvoices()
        setInvoices(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
      } finally {
        setLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  return { invoices, loading, error }
}
