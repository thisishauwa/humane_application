import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * Analyzes a LinkedIn post and generates three rewrites in different tones
 * Uses a two-stage approach: first analyze, then use that analysis to inform rewrites
 */
export async function analyzeAndRewritePost(post: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  // First, analyze the post for cringe factors and context
  const analysisPrompt = `
You're helping analyze a LinkedIn post to identify what makes it potentially "cringe" and how to improve it.
The post is: "${post}"

First, analyze this post for:
1. The core message/intent (what is the person actually trying to communicate?)
2. The specific elements that make it feel inauthentic or "cringe," if any:
   - Corporate jargon or buzzwords
   - Humble-bragging or self-promotion
   - Overly formal or dramatic tone
   - Forced storytelling or contrived lessons
   - Any disconnect between personal anecdotes and business advice
3. The topic and industry context of the post
4. Strengths to preserve in the rewrite

Based on these elements, please return a JSON response with:
- A score from 0-100 measuring how "cringe" the post is
- The core message that should be preserved
- 3-5 specific improvements that would make the post more authentic and engaging (use frank, direct language)
- The key elements that should be highlighted in rewrites

Response format:
{
  "score": number,
  "coreMessage": "string",
  "improvements": ["string", "string", "string"],
  "keyElements": ["string", "string"],
  "toneGuidance": "string"
}
`

  try {
    // Step 1: Get detailed analysis of the post
    const analysisResult = await model.generateContent(analysisPrompt)
    const analysisResponse = await analysisResult.response
    const analysisText = analysisResponse.text().trim()
    
    // Extract JSON from response (handle any text wrapper)
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/)
    const analysisJson = JSON.parse(jsonMatch ? jsonMatch[0] : analysisText)
    
    // Step 2: Use the detailed analysis to inform rewrites
    const rewritePrompt = `
You're rewriting a LinkedIn post to make it more authentic and engaging. You have three personas to write from:

1. HUMAN + RELATABLE: Conversational, genuine, and warm - like a trusted colleague sharing a thoughtful insight
2. BOLD + EDGY: Confident, direct, and thought-provoking - challenging conventions while remaining professional
3. PLAYFUL + WITTY: Light-hearted, clever, with subtle humor that feels natural and not forced

Here's the original post: "${post}"

The analysis shows:
- Core message to preserve: "${analysisJson.coreMessage}"
- Specific improvements needed:
${analysisJson.improvements.map((imp: string) => `  - ${imp}`).join('\\n')}
- Key elements to highlight: ${analysisJson.keyElements.join(', ')}
- Tone guidance: ${analysisJson.toneGuidance}
- Current cringe score: ${analysisJson.score}

For each rewrite:
- Focus on addressing the specific improvements above
- Preserve the core message
- Make it feel like it comes from a real person, not AI
- Avoid corporate jargon, buzzwords, and clichés
- Maintain authenticity and professionalism
- Keep the length similar to or shorter than the original post (${post.length} characters)
- Remember: shorter, more concise posts perform better on LinkedIn
- Cut unnecessary words and get straight to the point
- If the original is too long, make it significantly shorter while keeping the key message
- Your goal is to reduce the cringe score by at least 30 points (from ${analysisJson.score} to ${Math.max(0, analysisJson.score - 30)} or lower)
- Focus on eliminating the specific cringe factors identified in the analysis
- IMPORTANT: Each rewrite MUST address ALL of these specific improvements:
${analysisJson.improvements.map((imp: string) => `  - ${imp}`).join('\\n')}

Return a JSON response with:
{
  "analysis": {
    "score": ${analysisJson.score},
    "targetScore": ${Math.max(0, analysisJson.score - 30)},
    "cringeFactors": [list 3-5 specific phrases or elements that make the post cringe],
    "recommendations": [
      // If score > 80, return only: "That's too cringe, even for us"
      // Otherwise, generate 3-5 specific recommendations based on the actual post content.
      // Examples of the style (DO NOT COPY THESE EXACTLY):
      // - "You're begging for likes and engagement instead of providing value."
      // - "You sound too emotional when you say things like '[exact phrase]'."
      // - "You're being desperate and needy instead of confident."
      // - "Your skills section is bloated and unfocused."
      // - "You're not being specific about what you want - be direct."
      // Instead, analyze the post and provide specific, actionable recommendations.
    ]
  },
  "rewrites": {
    "humanRelatable": "full rewrite text",
    "boldEdgy": "full rewrite text",
    "playfulWitty": "full rewrite text"
  }
}

Important: Make sure each rewrite is complete and properly formatted. Do not exceed Gemini's token limits by creating excessively long responses.
`

    // Get the rewrites
    const rewriteResult = await model.generateContent(rewritePrompt)
    const rewriteResponse = await rewriteResult.response
    const rewriteText = rewriteResponse.text().trim()
    
    // Extract JSON from response (handle any text wrapper)
    const rewriteJsonMatch = rewriteText.match(/\{[\s\S]*\}/)
    
    if (!rewriteJsonMatch) {
      throw new Error("Failed to extract valid JSON from rewrite response")
    }
    
    let result
    try {
      result = JSON.parse(rewriteJsonMatch[0])
      
      // Validate the structure to catch incomplete JSON
      if (!result.rewrites || !result.rewrites.humanRelatable || 
          !result.rewrites.boldEdgy || !result.rewrites.playfulWitty) {
        throw new Error("Incomplete rewrites in response")
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError)
      throw new Error("Failed to parse rewrite JSON response")
    }
    
    // Format final response
    return {
      score: result.analysis.score,
      targetScore: result.analysis.targetScore || Math.max(0, result.analysis.score - 30),
      highlighted: highlightCringeFactors(post, result.analysis.cringeFactors),
      recommendations: result.analysis.score > 80 ? ["That's too cringe, even for us"] : result.analysis.recommendations,
      rewrites: result.analysis.score > 80 ? [] : [
        {
          tone: "human + relatable",
          text: result.rewrites.humanRelatable
        },
        {
          tone: "bold + edgy",
          text: result.rewrites.boldEdgy
        },
        {
          tone: "playful + witty",
          text: result.rewrites.playfulWitty
        }
      ]
    }
  } catch (error) {
    console.error("Error analyzing and rewriting post:", error)
    throw new Error(`Failed to analyze and rewrite post: ${error.message}`)
  }
}

/**
 * Simple function to highlight cringe factors in the original post
 */
function highlightCringeFactors(post: string, cringeFactors: string[]): string {
  let highlighted = post
  
  // If no cringe factors provided, return the original
  if (!Array.isArray(cringeFactors) || cringeFactors.length === 0) {
    return highlighted
  }
  
  // Sort cringe factors by length (descending) to handle overlapping phrases
  const sortedFactors = [...cringeFactors].sort((a, b) => b.length - a.length)
  
  // Replace each cringe factor with a highlighted version
  sortedFactors.forEach(factor => {
    if (!factor || typeof factor !== 'string') return
    
    // Determine the cringe type based on common patterns
    let cringeType = "Cringe element"
    if (/synerg|leverag|thought leader|game.?changer|disrupt|innovat/i.test(factor)) {
      cringeType = "Corporate jargon/buzzword"
    } else if (/humbled|honored|proud|thrilled to|excited to announce/i.test(factor)) {
      cringeType = "Humble-brag"
    } else if (/it is with great|pleased to inform|I am writing to/i.test(factor)) {
      cringeType = "Overly formal tone"
    } else if (/please like|please share|don't ignore|any support|would mean the world/i.test(factor)) {
      cringeType = "Begging for engagement"
    }
    
    // Create regex that handles word boundaries but works for punctuation
    const regex = new RegExp(`(\\b|\\s|^)(${factor.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})(\\b|\\s|$|[,.!?:;])`, 'gi')
    highlighted = highlighted.replace(regex, `$1<span class="cringe" title="${cringeType}">$2</span>$3`)
  })
  
  return highlighted
}

/**
 * Legacy function maintained for backward compatibility
 */
export async function analyzePost(post: string) {
  return analyzeAndRewritePost(post)
}

/**
 * Legacy function maintained for backward compatibility
 */
export async function rewritePost(post: string, tone: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `
You're rewriting a LinkedIn post to make it more authentic and engaging.
The post is: "${post}"

Rewrite it in a ${tone} tone.

Guidelines:
- Make it feel like it comes from a real person, not AI
- Avoid corporate jargon, buzzwords, and clichés
- Maintain authenticity and professionalism
- Keep it concise and to the point
- Focus on the core message
- Make it engaging and relatable

Return only the rewritten post text, nothing else.
`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text().trim()
  } catch (error: any) {
    console.error("Error rewriting post:", error)
    throw new Error(`Failed to generate rewrite for tone ${tone}`)
  }
}