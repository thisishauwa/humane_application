import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function GET(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to access your history" },
        { status: 401 }
      )
    }

    // Get URL parameters
    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const offset = (page - 1) * limit

    // Fetch rewrites with error handling
    const { data: rewrites, error: rewritesError } = await supabase
      .from("rewrites")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (rewritesError) {
      console.error("Error fetching rewrites:", rewritesError)
      return NextResponse.json(
        { error: "Database error", message: "Failed to fetch your rewrite history" },
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
        { error: "Database error", message: "Failed to get total count" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      rewrites: rewrites || [],
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
      { error: "Server error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    
    // Get user session
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error("Auth error:", authError)
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to delete rewrites" },
        { status: 401 }
      )
    }

    const { id } = await req.json()
    if (!id) {
      return NextResponse.json(
        { error: "Bad request", message: "Missing rewrite ID" },
        { status: 400 }
      )
    }

    const { error: deleteError } = await supabase
      .from("rewrites")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id)

    if (deleteError) {
      console.error("Error deleting rewrite:", deleteError)
      return NextResponse.json(
        { error: "Database error", message: "Failed to delete rewrite" },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      message: "Rewrite deleted successfully"
    })
  } catch (error) {
    console.error("Error in delete route:", error)
    return NextResponse.json(
      { error: "Server error", message: "An unexpected error occurred" },
      { status: 500 }
    )
  }
} 