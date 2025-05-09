import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { CreditCard } from "lucide-react"

export function BillingSection() {
  return (
    <div className="space-y-4">
      <div className="rounded-md bg-muted/50 p-3 text-sm">
        <h4 className="font-medium">Current Plan: Free</h4>
        <p className="mt-1 text-muted-foreground">4 rewrites remaining this month</p>
      </div>

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Subscription Plans</h3>
        <RadioGroup defaultValue="premium">
          <div className="flex items-center space-x-2 rounded-md border p-3">
            <RadioGroupItem value="free" id="free" />
            <Label htmlFor="free" className="flex flex-1 flex-col">
              <span>Free</span>
              <span className="text-xs text-muted-foreground">5 rewrites per month</span>
            </Label>
            <span className="font-medium">$0</span>
          </div>
          <div className="flex items-center space-x-2 rounded-md border border-primary bg-primary/5 p-3">
            <RadioGroupItem value="premium" id="premium" />
            <Label htmlFor="premium" className="flex flex-1 flex-col">
              <span>Premium</span>
              <span className="text-xs text-muted-foreground">Unlimited rewrites</span>
            </Label>
            <span className="font-medium">$9/mo</span>
          </div>
          <div className="flex items-center space-x-2 rounded-md border p-3">
            <RadioGroupItem value="team" id="team" />
            <Label htmlFor="team" className="flex flex-1 flex-col">
              <span>Team</span>
              <span className="text-xs text-muted-foreground">Unlimited rewrites for 5 users</span>
            </Label>
            <span className="font-medium">$39/mo</span>
          </div>
        </RadioGroup>
      </div>

      <Separator />

      <div className="space-y-2">
        <h3 className="text-sm font-medium">Payment Method</h3>
        <div className="rounded-md border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Visa ending in 4242</p>
                <p className="text-xs text-muted-foreground">Expires 12/2025</p>
              </div>
            </div>
            <button className="px-4 py-2 rounded-full bg-gradient-to-b from-blue-400 to-blue-500 text-white focus:ring-2 focus:ring-blue-300 hover:shadow-lg transition duration-200">
              Change
            </button>
          </div>
        </div>
      </div>

      <button className="w-full px-8 py-4 rounded-full bg-gradient-to-b from-blue-500 to-blue-600 text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200">
        Upgrade to Premium
      </button>

      <div className="text-center text-xs text-muted-foreground">You'll be charged $9 monthly. Cancel anytime.</div>
    </div>
  )
}
