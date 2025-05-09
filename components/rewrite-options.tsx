"use client"

import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface RewriteOptionsProps {
  originalPost: string
  onRewrite: (intensity: number) => void
}

export function RewriteOptions({ originalPost, onRewrite }: RewriteOptionsProps) {
  return (
    <div className="space-y-4">
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
      <Button onClick={() => onRewrite(5)} className="w-full">
        Generate Rewrites
      </Button>
    </div>
  )
}
