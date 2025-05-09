import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get URL parameters
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Fetch rewrites
    const { data: rewrites, error: rewritesError } = await supabase
      .from("rewrites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (rewritesError) {
      console.error("Error fetching rewrites:", rewritesError)
      return NextResponse.json(
        { error: "Failed to fetch rewrites" },
        { status: 500 }
      )
    }

    // Get total count for pagination
    const { count, error: countError } = await supabase
      .from("rewrites")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (countError) {
      console.error("Error getting count:", countError)
      return NextResponse.json(
        { error: "Failed to get total count" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      rewrites,
      pagination: {
        total: count || 0,
        page,
        limit,
        hasMore: (offset + limit) < (count || 0)
      }
    })
  } catch (error) {
    console.error("Error in history route:", error)
    return NextResponse.json(
      { error: "Failed to fetch history" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await req.json()

    if (!id) {
      return NextResponse.json(
        { error: "Missing rewrite ID" },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from("rewrites")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id) // Ensure user can only delete their own rewrites

    if (deleteError) {
      console.error("Error deleting rewrite:", deleteError)
      return NextResponse.json(
        { error: "Failed to delete rewrite" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error in delete route:", error)
    return NextResponse.json(
      { error: "Failed to delete rewrite" },
      { status: 500 }
    )
  }
} 