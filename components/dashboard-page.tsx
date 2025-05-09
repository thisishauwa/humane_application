"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Cringometer } from "@/components/cringometer"
import { ExportButtons } from "@/components/export-buttons"

export function DashboardPage() {
  const [post, setPost] = useState("")
  const [analyzed, setAnalyzed] = useState(false)
  const [score, setScore] = useState(0)
  const [highlighted, setHighlighted] = useState("")
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [rewrites, setRewrites] = useState<{ tone: string; text: string }[]>([])
  const [selectedRewrite, setSelectedRewrite] = useState("")

  const handleAnalyze = async () => {
    // Simulate API call to analyze post
    // In a real implementation, this would call the Supabase edge function
    setTimeout(() => {
      const mockScore = Math.floor(Math.random() * 100)
      const mockHighlighted = post.replace(
        /(synergy|leverage|paradigm|optimize|bandwidth|circle back|deep dive|best practices|thought leader)/gi,
        '<span class="bg-yellow-200 dark:bg-yellow-900">$1</span>',
      )
      const mockRecommendations = [
        "Avoid corporate jargon like 'synergy' and 'leverage'",
        "Use more personal and relatable language",
        "Share a specific story rather than general statements",
        "Reduce self-promotion and focus on value for readers",
      ]

      setScore(mockScore)
      setHighlighted(mockHighlighted)
      setRecommendations(mockRecommendations)
      setAnalyzed(true)
    }, 1000)
  }

  const handleRewrite = async (intensity: number) => {
    // Simulate API call to rewrite post
    // In a real implementation, this would call the Supabase edge function
    setTimeout(() => {
      const mockRewrites = [
        {
          tone: "Human & Relatable",
          text: "I'm excited to share that I just joined the team at Acme Corp! Looking forward to learning from this amazing group of people and contributing to some cool projects. If you're working on something similar, I'd love to connect!",
        },
        {
          tone: "Bold & Edgy",
          text: "Just landed at Acme Corp and ready to shake things up! No more corporate nonsense - just real work that matters. Who else is tired of the status quo? Let's chat if you're building something that actually makes a difference.",
        },
        {
          tone: "Playful & Witty",
          text: "New job, who dis? 👋 Just joined the Acme Corp crew and already found the good snacks in the break room. Priorities, right? Excited to dive into some fascinating projects that don't require a dictionary of buzzwords to explain!",
        },
      ]

      setRewrites(mockRewrites)
      setSelectedRewrite(mockRewrites[0].text)
    }, 1000)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Post Analyzer</CardTitle>
          <CardDescription>Paste your LinkedIn post to analyze and improve it</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Paste your LinkedIn post here..."
            className="min-h-[200px]"
            value={post}
            onChange={(e) => setPost(e.target.value)}
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">{post.length} characters</div>
          <Button onClick={handleAnalyze}>Analyze Post</Button>
        </CardFooter>
      </Card>

      {analyzed && (
        <Card>
          <CardHeader>
            <CardTitle>Cringometer</CardTitle>
            <CardDescription>How "corporate" does your post sound?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Cringometer score={score} />
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Highlighted Issues:</h4>
              <div className="rounded-md border p-3 text-sm" dangerouslySetInnerHTML={{ __html: highlighted }} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Recommendations:</h4>
              <ul className="list-disc pl-5 text-sm">
                {recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {analyzed && (
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Rewrite Engine</CardTitle>
            <CardDescription>Generate human-sounding alternatives to your post</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Rewrite Intensity</h4>
                <span className="text-sm text-muted-foreground">5</span>
              </div>
              <Slider defaultValue={[5]} max={10} step={1} />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Subtle</span>
                <span>Dramatic</span>
              </div>
            </div>
            <Button onClick={() => handleRewrite(5)} className="w-full">
              Generate Rewrites
            </Button>

            {rewrites.length > 0 && (
              <div className="space-y-4">
                <Tabs defaultValue={rewrites[0].tone.toLowerCase().replace(/\s+/g, "-")}>
                  <TabsList className="w-full">
                    {rewrites.map((rewrite) => (
                      <TabsTrigger
                        key={rewrite.tone}
                        value={rewrite.tone.toLowerCase().replace(/\s+/g, "-")}
                        onClick={() => setSelectedRewrite(rewrite.text)}
                      >
                        {rewrite.tone}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {rewrites.map((rewrite) => (
                    <TabsContent key={rewrite.tone} value={rewrite.tone.toLowerCase().replace(/\s+/g, "-")}>
                      <div className="rounded-md border p-4">{rewrite.text}</div>
                    </TabsContent>
                  ))}
                </Tabs>
                <ExportButtons text={selectedRewrite} />
              </div>
            )}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            <Badge variant="outline" className="mr-2">
              Free
            </Badge>
            4 rewrites remaining this month
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
