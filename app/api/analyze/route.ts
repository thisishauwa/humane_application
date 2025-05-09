import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// Simple function to detect corporate language patterns
function analyzePost(post: string) {
  const corporatePatterns = [
    { pattern: /\b(leverage|synergy|optimize|streamline|paradigm|leverage)\b/gi, weight: 10 },
    { pattern: /\b(disrupt|innovate|transform|revolutionize)\b/gi, weight: 8 },
    { pattern: /\b(think outside the box|circle back|touch base|reach out)\b/gi, weight: 7 },
    { pattern: /\b(utilize|implement|facilitate|enable)\b/gi, weight: 5 },
    { pattern: /\b(impact|leverage|strategic|holistic)\b/gi, weight: 4 },
    { pattern: /\b(going forward|moving forward|at the end of the day)\b/gi, weight: 3 },
  ]

  let score = 0
  let highlighted = post
  let recommendations: string[] = []

  // Calculate score and highlight matches
  corporatePatterns.forEach(({ pattern, weight }) => {
    const matches = post.match(pattern) || []
    score += matches.length * weight

    // Highlight matches in the text
    highlighted = highlighted.replace(pattern, match => 
      `<span class="bg-yellow-200 dark:bg-yellow-800">${match}</span>`
    )
  })

  // Cap score at 100
  score = Math.min(score, 100)

  // Generate recommendations based on patterns found
  if (post.match(/\b(leverage|synergy|optimize)\b/gi)) {
    recommendations.push("Replace corporate buzzwords with simpler alternatives")
  }
  if (post.match(/\b(think outside the box|circle back|touch base)\b/gi)) {
    recommendations.push("Avoid cliché corporate phrases")
  }
  if (post.match(/\b(going forward|moving forward)\b/gi)) {
    recommendations.push("Remove unnecessary filler phrases")
  }

  return {
    score,
    highlighted,
    recommendations: recommendations.length > 0 ? recommendations : ["Your post looks good! No major issues found."]
  }
}

export async function POST(req: Request) {
  try {
    const { post } = await req.json()

    if (!post) {
      return NextResponse.json(
        { error: "Missing post content" },
        { status: 400 }
      )
    }

    // Check user authentication
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // For development, allow analysis without authentication
    if (process.env.NODE_ENV === 'development') {
      const analysis = analyzePost(post)
      return NextResponse.json(analysis)
    }

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const analysis = analyzePost(post)
    return NextResponse.json(analysis)
  } catch (error: any) {
    console.error("Error in analyze route:", error)
    return NextResponse.json(
      { error: "Failed to analyze post" },
      { status: 500 }
    )
  }
} 