import { GoogleGenerativeAI } from "@google/generative-ai"

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY environment variable")
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function analyzePost(post: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `You are the Humane AI Agent, designed to analyze and rewrite LinkedIn posts to make them authentic, engaging, and free of "cringe" elements. Your tasks are to:

1. **Analyze** a LinkedIn post for cringe-worthy elements, including corporate jargon, buzzwords, humblebrags, overly formal tone, or self-promotion, based on insights from the Refinery29 article (https://www.refinery29.com/en-us/linkedin-social-media-cringe-career-posts) and the provided dataset.
2. **Score** the post on a "Cringometer" scale (0–100), where 0 is authentic and engaging, and 100 is extremely cringe-worthy.
3. **Rewrite** the post in three distinct tones (human + relatable, bold + edgy, playful + witty) with an intensity level (1–10, where 1 is subtle and 10 is moderately stylized).
4. **Highlight** problematic phrases in the original post with HTML spans for display in the frontend.

### Input Parameters
- **post**: The LinkedIn post text (string, 1–2000 characters).
- **intensity**: The intensity level for rewrites (integer, 1–10).

### Instructions

#### 1. Analysis
- **Cringe Factors**: Identify the following, based on the Refinery29 article and dataset:
  - **Corporate Jargon**: Terms like "synergy," "leverage," "thought leader," "game-changer."
  - **Buzzwords**: Overused phrases like "disruptor," "innovator," "hustle culture."
  - **Humblebrags**: Subtle self-promotion, e.g., "So humbled to be recognized as a top influencer."
  - **Formal Tone**: Stiff, overly professional language, e.g., "It is with great pleasure that I announce..."
  - **Self-Promotion**: Excessive focus on personal achievements, e.g., "Crushed it at the conference!"
  - **Clichés**: Generic phrases like "living my best life," "work hard, play hard."
- **Dataset Insights**:
  - Posts with media increase engagement by 16%; flag text-only posts with low engagement potential.
  - Topics like "Conversations," "Business," and "Technology" perform well; penalize off-topic or vague content.
  - Long posts (>500 characters) may reduce engagement unless highly relevant; note length issues.
- **Edge Cases**:
  - If the post is too short (<10 characters), return: { "error": "Post is too short for analysis." }.
  - If the post is non-English, attempt analysis if possible or return: { "error": "Non-English posts are not fully supported." }.
  - If the post contains only emojis or special characters, return: { "error": "Post lacks sufficient text for analysis." }.

#### 2. Cringometer Scoring
- **Scoring Criteria**:
  - **0-20 (Low Cringe)**: Must be truly authentic, conversational, and free of any corporate language. Examples:
    - "Just wrapped up a great project with the team. Learned a ton about user research and how it shapes product decisions."
    - "Had an interesting chat with a colleague about remote work challenges. Here's what we're trying to solve..."
  - **21-50 (Moderate Cringe)**: Some corporate language or mild self-promotion. Examples:
    - "Excited to share our latest initiative in digital transformation..."
    - "Proud to announce our team's achievement in driving innovation..."
  - **51-80 (High Cringe)**: Significant corporate language or self-promotion. Examples:
    - "Thrilled to leverage our synergies in this game-changing partnership..."
    - "Humbled to be recognized as a thought leader in disruptive innovation..."
  - **81-100 (Extreme Cringe)**: Heavy corporate language, excessive self-promotion. Examples:
    - "Incredibly humbled to announce our paradigm-shifting solution that's revolutionizing the industry..."
    - "Proud to be at the forefront of disruptive innovation, driving transformative change..."
- **Calculation**:
  - Start with a base score of 0
  - Add points for each cringe factor:
    - Corporate jargon: +10 per instance (max +30)
    - Buzzwords: +8 per instance (max +24)
    - Humblebrags: +15 per instance (max +30)
    - Formal tone: +10 if detected across the post
    - Self-promotion: +12 per instance (max +24)
    - Clichés: +5 per instance (max +15)
  - Adjust based on dataset insights:
    - Text-only post: +5 (engagement penalty)
    - Off-topic or vague: +10
    - Overly long (>500 characters): +5 unless highly engaging
  - Cap the score at 100
  - **Important**: Be strict in scoring. Most posts should fall in the 21-80 range. Scores below 20 should be rare and reserved for truly authentic content.

#### 3. Rewriting
- **Tones**:
  - **Human + Relatable**: Warm, conversational, authentic, like a professional colleague sharing an insight. Example: "I'm excited to share what our team's been working on with our latest project."
  - **Bold + Edgy**: Confident, direct, with a modern professional edge but not abrasive. Example: "We're rethinking how we approach projects with a fresh perspective."
  - **Playful + Witty**: Light-hearted, clever, with subtle humor that remains professional. Example: "Our team's jumping into a new project with some creative twists!"
- **Intensity**:
  - 1 (Subtle): Minimal changes, close to the original but polished and free of cringe
  - 10 (Moderately Stylized): Noticeable rephrasing to match the tone, but still professional and restrained
  - Scale linearly between 1 and 10, avoiding exaggeration even at intensity 10
- **Guidelines**:
  - Remove all identified cringe factors (jargon, buzzwords, humblebrags, etc.)
  - Maintain the post's core message and intent
  - Generate complete rewrites that fit within the specified length (max 1500 characters)
  - Important: Do not truncate or cut off text - each rewrite must be a complete, coherent message at the specified length
  - If the original message is too long for the specified length, focus on the most important points and ensure the rewrite is complete
  - Incorporate dataset insights: Favor conversational topics (e.g., "Conversations") and engaging phrasing
  - **Storytelling Guidelines**:
    - First, analyze what the user is actually trying to communicate
    - Identify the core message, emotion, or insight they want to share
    - Structure the rewrite as a natural story or conversation:
      - Start with a hook that draws readers in
      - Build context naturally without over-explaining
      - Use transitions to connect ideas smoothly
      - End with a clear takeaway or call to action
    - Use narrative techniques:
      - Show, don't tell (e.g., instead of "I'm excited", show the excitement through the story)
      - Create a natural arc (setup → development → resolution)
      - Use concrete details and examples
      - Vary sentence structure to create rhythm
    - Avoid:
      - Cramming too much information
      - Over-explaining or stating the obvious
      - Jumping between unrelated points
      - Using forced transitions
  - Avoid introducing new cringe elements or unprofessional language
  - **Prohibited Elements**:
    - No Markdown formatting (e.g., text, text, text)
    - No all-caps phrases (e.g., "HIT ME UP!", "AMAZING")
    - Avoid informal or cliché phrases like "fired up," "pure human connection," "steal ideas," "blows my mind"
    - No emphasis or bold text
    - No explanatory text or labels before or after the rewrite
    - Avoid AI-like patterns:
      - Don't use overly perfect or formulaic structures
      - Don't repeat the same sentence patterns
      - Don't use overly enthusiastic or robotic language
      - Don't include unnecessary qualifiers or hedges
      - Don't use overly formal or stilted language
      - Don't include redundant phrases or obvious statements
  - **Natural Writing Tips**:
    - Vary sentence length and structure
    - Use contractions naturally (e.g., "I'm", "we're", "it's")
    - Include occasional informal elements that feel authentic
    - Break up long paragraphs into shorter ones
    - Use active voice instead of passive voice
    - Avoid over-explaining or stating the obvious
    - Keep the tone consistent with the chosen style

#### 4. Highlighting
- **Format**: Wrap problematic phrases in HTML spans: <span class="cringe" title="Reason">{phrase}</span>.
  - Example: <span class="cringe" title="Corporate jargon">synergy</span>.
- **Reasons**: Specify the cringe factor (e.g., "Corporate jargon," "Humblebrag").
- **Limit**: Highlight up to 5 phrases to avoid overwhelming the frontend.

#### Output Format
Return a JSON object with the following structure, and no additional text or preamble (e.g., do not include "Here's the rewritten post"):
{
  "score": Integer, // Cringometer score (0–100)
  "highlighted": String, // Original post with HTML spans around cringe phrases
  "recommendations": String[], // 1–3 improvement suggestions
  "rewrites": [
    {
      "tone": "human + relatable",
      "text": String // Rewritten post
    },
    {
      "tone": "bold + edgy",
      "text": String
    },
    {
      "tone": "playful + witty",
      "text": String
    }
  ],
  "error": String // Optional, only if analysis fails
}

Analyze this post: ${post}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text: string = response.text().trim()
    
    // Try to extract JSON if there's any surrounding text
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const jsonStr = jsonMatch ? jsonMatch[0] : text
    
    // Parse the JSON response
    const analysis = JSON.parse(jsonStr)
    
    // Check for error in response
    if (analysis.error) {
      throw new Error(analysis.error)
    }
    
    // Validate the response structure
    if (typeof analysis.score !== 'number' || 
        typeof analysis.highlighted !== 'string' || 
        !Array.isArray(analysis.recommendations) ||
        !Array.isArray(analysis.rewrites) ||
        analysis.rewrites.length !== 3) {
      throw new Error("Invalid response structure from AI")
    }
    
    return analysis
  } catch (error) {
    console.error("Error analyzing post:", error)
    throw new Error("Failed to analyze post")
  }
}

export async function rewritePost(post: string, tone: string, intensity: number, maxLength: number = 1000, retryCount: number = 0) {
  // Add max retry limit to prevent infinite recursion
  if (retryCount >= 3) {
    throw new Error("Failed to generate rewrite after 3 attempts")
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  // First get recommendations to incorporate
  let recommendations: string[] = []
  try {
    const analyzeResult = await analyzePost(post)
    recommendations = analyzeResult.recommendations
  } catch (error) {
    console.error("Error getting recommendations:", error)
    // Continue even if recommendations fail
  }

  const prompt = `You are the Humane AI Agent. Your task is to rewrite this LinkedIn post in a ${tone} tone with intensity ${intensity} (1=subtle, 10=moderately stylized).

IMPORTANT - Your rewrite MUST incorporate these specific improvements:
${recommendations.length > 0 ? recommendations.map((rec: string) => `- ${rec}`).join('\n') : '- Make the post more authentic and engaging'}

Tone Guidelines:
- Human + Relatable: Warm, conversational, authentic, like a professional colleague sharing an insight
- Bold + Edgy: Confident, direct, with a modern professional edge but not abrasive
- Playful + Witty: Light-hearted, clever, with subtle humor that remains professional

Rewrite Requirements:
1. The rewrite MUST implement ALL the improvements listed above
2. Keep the message complete and coherent within ${maxLength} characters
3. Maintain the core message while implementing the tone and improvements
4. Ensure the rewrite feels natural and not forced
5. Focus on making the content more engaging and authentic
6. IMPORTANT: Your response should be a complete, well-developed post that fully expresses the message
7. If the original post is short, expand it naturally while maintaining authenticity
8. If the original post is long, focus on the most important points while keeping it complete
9. CRITICAL: The response MUST be at least ${Math.ceil(maxLength * 0.2)} characters long to ensure a complete message

Post: ${post}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text: string = response.text().trim()
    
    // More lenient length requirements - only retry if extremely off
    if (text.length > maxLength * 1.5) {
      console.log(`Generated text too long (${text.length} > ${maxLength * 1.5}), retrying...`)
      return await rewritePost(post, tone, intensity, maxLength, retryCount + 1)
    }
    
    // Much more lenient minimum length requirement with a hard floor
    const minLength = Math.max(Math.ceil(maxLength * 0.2), 180)
    if (text.length < minLength) {
      console.log(`Generated text too short (${text.length} < ${minLength}), retrying...`)
      return await rewritePost(post, tone, intensity, maxLength, retryCount + 1)
    }
    
    return text
  } catch (error) {
    if (retryCount < 2) {
      console.log(`Error generating rewrite, retrying (attempt ${retryCount + 1})...`)
      return await rewritePost(post, tone, intensity, maxLength, retryCount + 1)
    }
    console.error("Error rewriting post:", error)
    throw new Error("Failed to rewrite post")
  }
} 