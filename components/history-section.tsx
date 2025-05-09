import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Trash2 } from "lucide-react"

export function HistorySection() {
  // Mock history data
  const historyItems = [
    {
      id: 1,
      date: "May 9, 2025",
      originalText:
        "Excited to announce that I've joined Acme Corp as a Senior Innovation Strategist. Looking forward to leveraging my expertise to drive synergy and optimize business outcomes in this dynamic role.",
      rewrittenText:
        "I'm excited to share that I just joined the team at Acme Corp! Looking forward to learning from this amazing group of people and contributing to some cool projects.",
      score: 78,
      tone: "Human & Relatable",
    },
    {
      id: 2,
      date: "May 8, 2025",
      originalText:
        "Just completed a deep dive into our Q2 metrics. Thrilled to report that we've exceeded our KPIs by implementing best practices across all verticals. #ThoughtLeadership #BusinessSuccess",
      rewrittenText:
        "Just finished analyzing our Q2 results and I'm happy to share we beat our targets! The whole team worked hard to make this happen. What strategies are working for your team this quarter?",
      score: 85,
      tone: "Bold & Edgy",
    },
    {
      id: 3,
      date: "May 7, 2025",
      originalText:
        "Honored to be selected as a keynote speaker at the upcoming Global Innovation Summit. Will be sharing insights on paradigm shifts in the industry landscape.",
      rewrittenText:
        "Excited to speak at the Global Innovation Summit next month! I'll be sharing what I've learned about recent industry changes. Anyone else attending? Would love to connect!",
      score: 62,
      tone: "Playful & Witty",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <h4 className="font-medium">Your Rewrite History</h4>
        <p className="mt-1 text-muted-foreground">View and manage your previous rewrites</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {historyItems.map((item) => (
          <div key={item.id} className="rounded-md border p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{item.date}</span>
              <Badge variant="outline">{item.tone}</Badge>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium">Original:</p>
              <p className="text-xs line-clamp-2">{item.originalText}</p>
            </div>

            <Separator className="my-1" />

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium">Rewritten:</p>
                <Badge variant={item.score > 70 ? "destructive" : "success"} className="text-[10px] h-4">
                  Score: {item.score}
                </Badge>
              </div>
              <p className="text-xs line-clamp-2">{item.rewrittenText}</p>
            </div>

            <div className="flex justify-end gap-2 mt-1">
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Copy className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:text-red-500">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" size="sm" className="w-full">
        Load More
      </Button>
    </div>
  )
}
