import { useState, useEffect } from 'react' // ✅ Add useState import
import { Invoice, getInvoices } from '@/lib/invoice-data'

export function useInvoices() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const data = await getInvoices()
      setInvoices(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [])

  return { 
    invoices, 
    loading, 
    error, 
    refetch: fetchInvoices
  }
}
