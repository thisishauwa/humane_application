"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Copy, Download, User, CreditCard, History, Info } from "lucide-react"
import { ProfileSection } from "@/components/profile-section"
import { BillingSection } from "@/components/billing-section"
import { HistorySection } from "@/components/history-section"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"

export function HumanePlayground() {
  const router = useRouter()
  const { toast } = useToast()
  const [post, setPost] = useState("")
  const [analyzed, setAnalyzed] = useState(false)
  const [score, setScore] = useState(0)
  const [highlighted, setHighlighted] = useState("")
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [rewrites, setRewrites] = useState<{ tone: string; text: string }[]>([])
  const [selectedRewrite, setSelectedRewrite] = useState("")
  const [activeMode, setActiveMode] = useState<"instructions" | "history">("instructions")
  const [activeSection, setActiveSection] = useState<"main" | "profile" | "billing" | "settings">("main")
  const [contentType, setContentType] = useState<"linkedin" | "twitter" | "email">("linkedin")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [historyKey, setHistoryKey] = useState(0)
  const [fullName, setFullName] = useState<string | null>(null)

  const loadingStates = [
    { text: "Scanning for corporate jargon" },
    { text: "Identifying humblebrags" },
    { text: "Detecting buzzwords" },
    { text: "Measuring authenticity" },
    { text: "Calculating cringe factor" },
    { text: "Generating human alternatives" },
    { text: "Polishing final rewrites" },
    { text: "Preparing results" },
  ]

  const getPlaceholderText = () => {
    switch (contentType) {
      case "linkedin":
        return "Write your LinkedIn post here..."
      case "twitter":
        return "Write your Twitter post here..."
      case "email":
        return "Write your email content here..."
      default:
        return "Write your content here..."
    }
  }

  const handleAnalyze = async () => {
    if (!post.trim()) {
      setError("Please enter a post to analyze")
      return
    }

    setLoading(true)
    setError(null)
    setRewrites([]) // Clear previous rewrites
    setAnalyzed(false) // Reset analysis state

    try {
      // First, analyze the post
      const analyzeResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post }),
      })

      if (!analyzeResponse.ok) {
        const data = await analyzeResponse.json()
        throw new Error(data.error || "Failed to analyze post")
      }

      const analyzeData = await analyzeResponse.json()
      setAnalyzed(true)
      setScore(analyzeData.score)
      setHighlighted(analyzeData.highlighted)
      setRecommendations(analyzeData.recommendations)

      // Then, generate rewrites with different tones
      const tones = ["Human + Relatable", "Bold + Edgy", "Playful + Witty"]
      const newRewrites = []
      const maxRetries = 3

      for (const tone of tones) {
        let retryCount = 0
        let success = false

        while (retryCount < maxRetries && !success) {
          try {
            const rewriteResponse = await fetch("/api/rewrite", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ 
                post, 
                tone, 
              }),
            })

            if (rewriteResponse.ok) {
              const rewriteData = await rewriteResponse.json()
              newRewrites.push({ tone, text: rewriteData.rewrittenPost })
              success = true
            } else {
              throw new Error(`Failed to generate rewrite for tone ${tone}`)
            }
          } catch (err) {
            console.error(`Failed to generate rewrite for tone ${tone} (attempt ${retryCount + 1}):`, err)
            retryCount++
            if (retryCount === maxRetries) {
              console.error(`Failed to generate rewrite for tone ${tone} after ${maxRetries} attempts`)
            }
            // Wait a bit before retrying
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      if (newRewrites.length > 0) {
        setRewrites(newRewrites)
        setSelectedRewrite(newRewrites[0].text)
        setHistoryKey(prev => prev + 1)
      } else {
        setError("Failed to generate any rewrites")
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(selectedRewrite || post)
    toast({
      title: "Copied to clipboard",
      description: "Your text has been copied successfully",
    })
  }

  const download = (format: "txt" | "md") => {
    const content = selectedRewrite || post
    const blob = new Blob([content], { type: format === "txt" ? "text/plain" : "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `post.${format}`
    a.click()
  }

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      toast({
        title: "Signed out successfully",
        description: "You have been logged out.",
      })
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const getScoreColor = (score: number) => {
    if (score <= 20) return "bg-green-500"
    if (score <= 50) return "bg-yellow-500"
    if (score <= 80) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score <= 20) return "Soft"
    if (score <= 50) return "Slightly Cringe"
    if (score <= 80) return "Very Cringe"
    return "Maximum Cringe"
  }

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single();
      setFullName(profile?.full_name || null);
    };
    fetchProfile();
  }, []);

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }

  const renderMainContent = () => (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px]">
      <div className="flex flex-col space-y-4">
        <Card className="flex-1 rounded-lg border p-4">
          <div className="relative flex flex-col h-full">
            <Textarea
              placeholder={getPlaceholderText()}
              className="min-h-[300px] w-full resize-none border-0 p-0 focus-visible:ring-0 flex-grow"
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
            <div className="text-sm text-muted-foreground mt-2">
              {post.length} characters
            </div>
            <div className="block sm:hidden mt-4">
              <button
                className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                onClick={handleAnalyze}
                disabled={loading || !post.trim()}
              >
                {loading ? "Analyzing..." : "Analyze & Rewrite"}
              </button>
            </div>
          </div>
        </Card>

        {analyzed && (
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-bold">Cringometer</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{getScoreLabel(score)}</span>
                  <span className="text-sm font-medium">{score}/100</span>
                </div>
                <Progress value={score} className={getScoreColor(score)} />
              </div>
            </div>

            <div className="rounded-lg border p-4">
              <h3 className="mb-2 text-sm font-bold">Recommendations</h3>
              <ul className="list-disc pl-5 text-sm">
                {recommendations.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>

            {rewrites.length > 0 && (
              <div className="rounded-lg border p-4">
                <h3 className="mb-2 text-sm font-bold">Rewrite Options</h3>
                <Tabs defaultValue={rewrites[0].tone}>
                  <TabsList className="w-full flex px-0.5 pb-[5px] m-0 gap-0 rounded-lg border bg-gray-100 overflow-hidden">
                    {rewrites.map((rewrite, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === rewrites.length - 1;
                      return (
                        <TabsTrigger
                          key={rewrite.tone}
                          value={rewrite.tone}
                          onClick={() => setSelectedRewrite(rewrite.text)}
                          className={[
                            "flex-1 py-2 text-sm font-medium border-0 border-r last:border-r-0 transition-colors",
                            isFirst ? "rounded-l-md" : "",
                            isLast ? "rounded-r-md" : "",
                            "data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:z-10 data-[state=active]:border-t data-[state=active]:border-l data-[state=active]:border-r data-[state=active]:border-gray-200 data-[state=active]:border-b-0 data-[state=active]:shadow-sm",
                            "data-[state=inactive]:bg-gray-100 data-[state=inactive]:text-gray-700"
                          ].join(" ")}
                        >
                          {rewrite.tone}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {rewrites.map((rewrite) => (
                    <TabsContent key={rewrite.tone} value={rewrite.tone}>
                      <div className="mt-2 rounded-md bg-muted/50 p-4 text-sm">{rewrite.text}</div>
                    </TabsContent>
                  ))}
                </Tabs>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
                    onClick={copyToClipboard}
                  >
                    <Copy className="mr-2 h-4 w-4 inline" />
                    Copy
                  </button>
                  <button
                    className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
                    onClick={() => download("txt")}
                  >
                    <Download className="mr-2 h-4 w-4 inline" />
                    Download .txt
                  </button>
                  <button
                    className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
                    onClick={() => download("md")}
                  >
                    <Download className="mr-2 h-4 w-4 inline" />
                    Download .md
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="space-y-4 rounded-lg border p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Mode</h3>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeMode === "instructions" ? "default" : "outline"}
                size="sm"
                className="flex-1 justify-center"
                onClick={() => setActiveMode("instructions")}
              >
                <Info className="h-5 w-5" />
              </Button>
              <Button
                variant={activeMode === "history" ? "default" : "outline"}
                size="sm"
                className="flex-1 justify-center"
                onClick={() => setActiveMode("history")}
              >
                <History className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {activeMode === "instructions" && (
            <div className="space-y-4">
              <div className="rounded-md bg-muted/50 p-3 text-sm">
                <h4 className="font-medium">How to use Humane:</h4>
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  <li>Paste your {contentType} post in the text area</li>
                  <li>Click "Analyze & Rewrite" to check your post's "cringe factor"</li>
                  <li>Review the analysis and suggested rewrites</li>
                  <li>Choose a rewrite style that fits your voice</li>
                  <li>Copy or download your improved post</li>
                </ol>
              </div>
              {/* On desktop, show Analyze & Rewrite button here */}
              <div className="hidden sm:block">
                <button
                  className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
                  onClick={handleAnalyze}
                  disabled={loading || !post.trim()}
                >
                  {loading ? "Analyzing..." : "Analyze & Rewrite"}
                </button>
              </div>
            </div>
          )}

          {activeMode === "history" && <HistorySection key={historyKey} />}
        </div>

        <div className="rounded-lg border p-4">
          <h3 className="mb-2 text-sm font-bold">Usage</h3>
          <div className="text-sm text-muted-foreground">
            <p>Free plan: 4 rewrites remaining this month</p>
            <button
              className="w-full mt-2 px-8 py-3 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
              onClick={() => setActiveSection("billing")}
            >
              Upgrade to Premium ($9/month)
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-[1400px] p-4">
      <div className="mb-6 flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-bold">{getGreeting()}, {fullName || "there"}</h1>
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
            onClick={() => setActiveSection("profile")}
          >
            <User className="h-4 w-4" />
          </button>
          <button
            className="p-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
            onClick={() => setActiveSection("billing")}
          >
            <CreditCard className="h-4 w-4" />
          </button>
        </div>
      </div>

      {activeSection === "main" && renderMainContent()}
      {activeSection === "profile" && (
        <div className="mx-auto max-w-md">
          <button
            className="mb-4 px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
            onClick={() => setActiveSection("main")}
          >
            ← Back
          </button>
          <Card className="rounded-lg border p-6">
            <ProfileSection onLogoutClick={handleLogout} />
          </Card>
        </div>
      )}
      {activeSection === "billing" && (
        <div className="mx-auto max-w-md">
          <button
            className="mb-4 px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200"
            onClick={() => setActiveSection("main")}
          >
            ← Back
          </button>
          <Card className="rounded-lg border p-6">
            <BillingSection />
          </Card>
        </div>
      )}

      {/* Multi-step loader */}
      <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={1000} />
    </div>
  )
}
