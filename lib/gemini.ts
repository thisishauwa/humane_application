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
  - **0–20 (Low Cringe)**: Authentic, conversational, no jargon or self-promotion.
  - **21–50 (Moderate Cringe)**: Some jargon, mild self-promotion, or formal tone.
  - **51–80 (High Cringe)**: Frequent jargon, humblebrags, or excessive formality.
  - **81–100 (Extreme Cringe)**: Heavy jargon, overt self-promotion, or cliché-ridden.
- **Calculation**:
  - Start with a base score of 0.
  - Add points for each cringe factor:
    - Corporate jargon: +10 per instance (max +30).
    - Buzzwords: +8 per instance (max +24).
    - Humblebrags: +15 per instance (max +30).
    - Formal tone: +10 if detected across the post.
    - Self-promotion: +12 per instance (max +24).
    - Clichés: +5 per instance (max +15).
  - Adjust based on dataset insights:
    - Text-only post: +5 (engagement penalty).
    - Off-topic or vague: +10.
    - Overly long (>500 characters): +5 unless highly engaging.
  - Cap the score at 100.
- **Recommendations**:
  - Provide 1–3 specific suggestions to improve the post, e.g., "Replace 'synergy' with a clearer term like 'collaboration'," "Reduce self-promotion by focusing on team efforts."

#### 3. Rewriting
- **Tones**:
  - **Human + Relatable**: Warm, conversational, authentic, like a professional colleague sharing an insight. Example: "I'm excited to share what our team's been working on with our latest project."
  - **Bold + Edgy**: Confident, direct, with a modern professional edge but not abrasive. Example: "We're rethinking how we approach projects with a fresh perspective."
  - **Playful + Witty**: Light-hearted, clever, with subtle humor that remains professional. Example: "Our team's jumping into a new project with some creative twists!"
- **Intensity**:
  - 1 (Subtle): Minimal changes, close to the original but polished and free of cringe.
  - 10 (Moderately Stylized): Noticeable rephrasing to match the tone, but still professional and restrained.
  - Scale linearly between 1 and 10, avoiding exaggeration even at intensity 10.
- **Guidelines**:
  - Remove all identified cringe factors (jargon, buzzwords, humblebrags, etc.).
  - Maintain the post's core message and intent.
  - Keep rewrites concise (target 80–120% of original length, max 500 characters).
  - Incorporate dataset insights: Favor conversational topics (e.g., "Conversations") and engaging phrasing.
  - Avoid introducing new cringe elements or unprofessional language.
  - **Prohibited Elements**:
    - Do not use Markdown formatting (e.g., \*text\*, \*\*text\*\*, \`text\`).
    - Do not use all-caps phrases (e.g., "HIT ME UP!", "AMAZING").
    - Avoid informal or cliché phrases like "fired up," "pure human connection," "steal ideas," "blows my mind."
    - Ensure rewrites sound polished and professional, suitable for LinkedIn's audience.
- **Edge Cases**:
  - If the post is too short, expand slightly to convey the intent.
  - If the post is ambiguous, infer a professional context (e.g., assume it's about work).

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

export async function rewritePost(post: string, tone: string, intensity: number) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" })

  const prompt = `You are the Humane AI Agent, designed to rewrite LinkedIn posts to make them authentic and engaging. Rewrite this post in a ${tone} tone with intensity ${intensity} (1=subtle, 10=moderately stylized).

Guidelines:
- Remove corporate jargon, buzzwords, humblebrags, and clichés
- Maintain the post's core message and intent
- Keep the rewrite concise (80-120% of original length, max 500 characters)
- Sound polished and professional, suitable for LinkedIn's audience

Prohibited Elements:
- No Markdown formatting (e.g., \*text\*, \*\*text\*\*, \`text\`)
- No all-caps phrases (e.g., "HIT ME UP!", "AMAZING")
- Avoid informal or cliché phrases like "fired up," "pure human connection," "steal ideas," "blows my mind"

Tone Guidelines:
- Human + Relatable: Warm, conversational, authentic, like a professional colleague sharing an insight
- Bold + Edgy: Confident, direct, with a modern professional edge but not abrasive
- Playful + Witty: Light-hearted, clever, with subtle humor that remains professional

Post: ${post}

Remember: Respond with ONLY the rewritten post, no additional text or explanations.`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text: string = response.text().trim()
    return text
  } catch (error) {
    console.error("Error rewriting post:", error)
    throw new Error("Failed to rewrite post")
  }
} 