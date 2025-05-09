import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function ProfilePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>John Doe</CardTitle>
              <CardDescription>john.doe@example.com</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Subscription</div>
            <div className="flex items-center gap-2">
              <Badge>Free Plan</Badge>
              <span className="text-sm text-muted-foreground">4 rewrites remaining this month</span>
            </div>
          </div>
          <Button className="w-full">Upgrade to Premium ($9/month)</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Rewrite History</CardTitle>
          <CardDescription>Your recent post rewrites</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-md border p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Rewritten on {new Date().toLocaleDateString()}</div>
                <Badge variant="outline">Human & Relatable</Badge>
              </div>
              <div className="text-sm">
                I'm excited to share that I just joined the team at Acme Corp! Looking forward to learning from this
                amazing group of people and contributing to some cool projects.
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Load More
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
