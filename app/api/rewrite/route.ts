import { NextResponse } from "next/server"
import { rewritePost } from "@/lib/gemini"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  try {
    const { post, tone, intensity, maxLength } = await req.json()

    if (!post || !tone || !intensity) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Validate intensity
    const intensityNum = Number(intensity)
    if (isNaN(intensityNum) || intensityNum < 1 || intensityNum > 10) {
      return NextResponse.json(
        { error: "Intensity must be a number between 1 and 10" },
        { status: 400 }
      )
    }

    // Validate maxLength
    const maxLengthNum = Number(maxLength) || 1000
    if (isNaN(maxLengthNum) || maxLengthNum < 1 || maxLengthNum > 2000) {
      return NextResponse.json(
        { error: "Max length must be a number between 1 and 2000" },
        { status: 400 }
      )
    }

    // For development, allow rewrites without authentication
    if (process.env.NODE_ENV !== 'production') {
      const rewrittenPost = await rewritePost(post, tone, intensityNum, maxLengthNum)
      return NextResponse.json({ rewrittenPost })
    }

    // Check user authentication
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check usage limits
    const { data: usage, error: usageError } = await supabase
      .from("usage")
      .select("rewrite_count")
      .eq("user_id", user.id)
      .single()

    if (usageError) {
      console.error("Error checking usage:", usageError)
      // For development, continue even if usage check fails
      if (process.env.NODE_ENV !== 'production') {
        const rewrittenPost = await rewritePost(post, tone, intensityNum, maxLengthNum)
        return NextResponse.json({ rewrittenPost })
      }
      return NextResponse.json(
        { error: "Failed to check usage limits" },
        { status: 500 }
      )
    }

    const rewriteCount = usage?.rewrite_count || 0
    if (rewriteCount >= 4) {
      // For development, allow rewrites even if limit is reached
      if (process.env.NODE_ENV !== 'production') {
        const rewrittenPost = await rewritePost(post, tone, intensityNum, maxLengthNum)
        return NextResponse.json({ rewrittenPost })
      }
      return NextResponse.json(
        { error: "Free rewrite limit reached. Please upgrade to continue." },
        { status: 403 }
      )
    }

    // Generate rewrite
    const rewrittenPost = await rewritePost(post, tone, intensityNum, maxLengthNum)

    // Save rewrite to database
    const { error: rewriteError } = await supabase
      .from("rewrites")
      .insert({
        user_id: user.id,
        original_post: post,
        rewritten_post: rewrittenPost,
        tone: tone,
        cringe_score: 0, // We'll update this later if needed
      })

    if (rewriteError) {
      console.error("Error saving rewrite:", rewriteError)
      // Continue even if save fails
    }

    // Update usage count
    const { error: updateError } = await supabase
      .from("usage")
      .upsert({
        user_id: user.id,
        rewrite_count: rewriteCount + 1,
        updated_at: new Date().toISOString(),
      })

    if (updateError) {
      console.error("Error updating usage:", updateError)
      // Continue even if usage update fails
    }

    return NextResponse.json({ rewrittenPost })
  } catch (error: any) {
    console.error("Error in rewrite route:", error)
    
    if (error.message?.includes("AI model")) {
      return NextResponse.json(
        { error: "AI model is currently unavailable. Please try again later." },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to rewrite post" },
      { status: 500 }
    )
  }
} 