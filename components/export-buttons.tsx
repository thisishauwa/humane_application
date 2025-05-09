"use client"

import { Button } from "@/components/ui/button"
import { Copy, Download, Share2 } from "lucide-react"

interface ExportButtonsProps {
  text: string
}

export function ExportButtons({ text }: ExportButtonsProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text)
  }

  const download = (format: "txt" | "md") => {
    const blob = new Blob([text], { type: format === "txt" ? "text/plain" : "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `post.${format}`
    a.click()
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" size="sm" onClick={copyToClipboard}>
        <Copy className="mr-2 h-4 w-4" />
        Copy
      </Button>
      <Button variant="outline" size="sm" onClick={() => download("txt")}>
        <Download className="mr-2 h-4 w-4" />
        Download .txt
      </Button>
      <Button variant="outline" size="sm" onClick={() => download("md")}>
        <Download className="mr-2 h-4 w-4" />
        Download .md
      </Button>
      <Button variant="outline" size="sm">
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  )
}
