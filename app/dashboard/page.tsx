import { HumanePlayground } from "@/components/humane-playground"

export default function Dashboard() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <HumanePlayground />
      </main>
    </div>
  )
}
