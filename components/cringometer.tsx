import { Progress } from "@/components/ui/progress"

interface CringometerProps {
  score: number
}

export function Cringometer({ score }: CringometerProps) {
  const getScoreColor = (score: number) => {
    if (score <= 20) return "bg-green-500"
    if (score <= 50) return "bg-yellow-500"
    if (score <= 80) return "bg-orange-500"
    return "bg-red-500"
  }

  const getScoreLabel = (score: number) => {
    if (score <= 20) return "Authentic"
    if (score <= 50) return "Slightly Corporate"
    if (score <= 80) return "Very Corporate"
    return "Maximum Cringe"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{getScoreLabel(score)}</span>
        <span className="text-sm font-medium">{score}/100</span>
      </div>
      <Progress value={score} className={getScoreColor(score)} />
    </div>
  )
}
