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
    const category = searchParams.get("category")
    const search = searchParams.get("search")

    let query = supabase.from("products").select("*").eq("is_active", true)

    if (category) {
      query = query.eq("category", category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,sku.ilike.%${search}%`)
    }

    const { data, error } = await query.order("name")

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Products API error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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

    const { data, error } = await supabase.from("products").insert([body]).select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error("[v0] Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
