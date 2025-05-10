"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Rewrite {
  id: string
  original_post: string
  rewritten_post: string
  tone: string
  cringe_score: number
  created_at: string
}

interface Pagination {
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export function HistorySection() {
  const [rewrites, setRewrites] = useState<Rewrite[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    hasMore: false
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchRewrites = async (page: number = 1) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/history?page=${page}&limit=${pagination.limit}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch rewrites")
      }

      setRewrites(data.rewrites)
      setPagination(data.pagination)
    } catch (error) {
      console.error("Error fetching rewrites:", error)
      setError(error instanceof Error ? error.message : "Failed to load rewrite history")
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load rewrite history",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRewrites()
  }, [])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copied!",
        description: "Text copied to clipboard",
      })
    } catch (error) {
      console.error("Error copying text:", error)
      toast({
        title: "Error",
        description: "Failed to copy text",
        variant: "destructive"
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/history", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete rewrite")
      }

      setRewrites(rewrites.filter(rewrite => rewrite.id !== id))
      toast({
        title: "Success",
        description: "Rewrite deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting rewrite:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete rewrite",
        variant: "destructive"
      })
    }
  }

  const handleLoadMore = () => {
    if (pagination.hasMore) {
      fetchRewrites(pagination.page + 1)
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <h4 className="font-medium">Your Rewrite History</h4>
        <p className="mt-1 text-muted-foreground">View and manage your previous rewrites</p>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
        {loading && rewrites.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">Loading...</div>
        ) : error ? (
          <div className="text-center text-sm text-red-500 py-4">{error}</div>
        ) : rewrites.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">No rewrites yet</div>
        ) : (
          rewrites.map((rewrite) => (
            <div key={rewrite.id} className="rounded-md border p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {new Date(rewrite.created_at).toLocaleDateString()}
                </span>
                <Badge variant="outline">{rewrite.tone}</Badge>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-medium">Original:</p>
                <p className="text-xs line-clamp-2">{rewrite.original_post}</p>
              </div>

              <Separator className="my-1" />

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium">Rewritten:</p>
                  <Badge variant={rewrite.cringe_score > 70 ? "destructive" : "default"} className="text-[10px] h-4">
                    Score: {rewrite.cringe_score}
                  </Badge>
                </div>
                <p className="text-xs line-clamp-2">{rewrite.rewritten_post}</p>
              </div>

              <div className="flex justify-end gap-2 mt-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6"
                  onClick={() => handleCopy(rewrite.rewritten_post)}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-6 w-6 text-red-500 hover:text-red-500"
                  onClick={() => handleDelete(rewrite.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {pagination.hasMore && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          onClick={handleLoadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </Button>
      )}
    </div>
  )
}
