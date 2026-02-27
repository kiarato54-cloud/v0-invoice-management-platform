import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    const searchParams = request.nextUrl.searchParams
    const branchId = searchParams.get("branch_id")
    const startDate = searchParams.get("start_date")
    const endDate = searchParams.get("end_date")

    let query = supabase.from("pos_transactions").select("*, transaction_items(*), payment_methods(*)")

    if (branchId) {
      query = query.eq("branch_id", branchId)
    }

    if (startDate) {
      query = query.gte("created_at", startDate)
    }

    if (endDate) {
      query = query.lte("created_at", endDate)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Transactions API error:", error)
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
        },
      },
    )

    const body = await request.json()
    const { transaction, items, payments } = body

    // Generate transaction number
    const transactionNumber = `TXN-${Date.now()}`

    const transactionData = {
      ...transaction,
      transaction_number: transactionNumber,
    }

    const { data: txnData, error: txnError } = await supabase
      .from("pos_transactions")
      .insert([transactionData])
      .select()

    if (txnError) throw txnError

    const txnId = txnData[0].id

    // Insert transaction items
    if (items && items.length > 0) {
      const itemsData = items.map((item: any) => ({
        ...item,
        transaction_id: txnId,
      }))

      const { error: itemsError } = await supabase.from("transaction_items").insert(itemsData)

      if (itemsError) throw itemsError
    }

    // Insert payment methods
    if (payments && payments.length > 0) {
      const paymentsData = payments.map((payment: any) => ({
        ...payment,
        transaction_id: txnId,
      }))

      const { error: paymentsError } = await supabase.from("payment_methods").insert(paymentsData)

      if (paymentsError) throw paymentsError
    }

    return NextResponse.json(txnData[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Create transaction error:", error)
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 })
  }
}
