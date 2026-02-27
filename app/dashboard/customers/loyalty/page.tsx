"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LoyaltyTier {
  tier: string
  minSpent: number
  maxSpent: number
  benefits: string[]
  pointsMultiplier: number
  color: string
}

const loyaltyTiers: LoyaltyTier[] = [
  {
    tier: "Bronze",
    minSpent: 0,
    maxSpent: 1000000,
    benefits: ["1 point per 1000 Tshs", "Birthday discount"],
    pointsMultiplier: 1,
    color: "bg-orange-500/20 text-orange-700 border-orange-500/50",
  },
  {
    tier: "Silver",
    minSpent: 1000000,
    maxSpent: 3000000,
    benefits: ["1.5 points per 1000 Tshs", "10% exclusive discounts", "Free delivery"],
    pointsMultiplier: 1.5,
    color: "bg-gray-400/20 text-gray-700 border-gray-400/50",
  },
  {
    tier: "Gold",
    minSpent: 3000000,
    maxSpent: 7000000,
    benefits: ["2 points per 1000 Tshs", "15% exclusive discounts", "Priority support", "Free shipping"],
    pointsMultiplier: 2,
    color: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  },
  {
    tier: "Platinum",
    minSpent: 7000000,
    maxSpent: Number.POSITIVE_INFINITY,
    benefits: [
      "3 points per 1000 Tshs",
      "20% exclusive discounts",
      "VIP support",
      "Free shipping",
      "Personal account manager",
    ],
    pointsMultiplier: 3,
    color: "bg-blue-500/20 text-blue-700 border-blue-500/50",
  },
]

const rewardOptions = [
  { points: 500, reward: "10% Discount", value: "Tshs 100K+" },
  { points: 1000, reward: "Free Delivery", value: "Delivery up to Tshs 50K" },
  { points: 2000, reward: "20% Discount", value: "Tshs 200K+" },
  { points: 5000, reward: "VIP Membership (1 month)", value: "All benefits" },
]

export default function LoyaltyPage() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Loyalty Program</h1>
          <p className="text-muted-foreground mt-1">Manage customer rewards and tier benefits</p>
        </div>

        {/* Loyalty Tiers */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Membership Tiers</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loyaltyTiers.map((tier, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{tier.tier}</CardTitle>
                    <span className={`text-2xl ${tier.color.split(" ")[1]}`}>
                      {tier.tier === "Bronze" && "🥉"}
                      {tier.tier === "Silver" && "🥈"}
                      {tier.tier === "Gold" && "🥇"}
                      {tier.tier === "Platinum" && "👑"}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Min. Spending</p>
                    <p className="text-sm font-bold">Tshs {(tier.minSpent / 1000000).toFixed(0)}M+</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Benefits</p>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, j) => (
                        <li key={j} className="text-xs flex items-start gap-2">
                          <span className="text-primary mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reward Catalog */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Reward Catalog</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {rewardOptions.map((option, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium">{option.reward}</p>
                      <p className="text-xs text-muted-foreground">{option.value}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Redeem
                    </Button>
                  </div>
                  <div className="px-3 py-2 bg-primary/10 rounded-md">
                    <p className="text-xs text-muted-foreground">Points required</p>
                    <p className="text-lg font-bold text-primary">{option.points.toLocaleString()}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Points System */}
        <Card>
          <CardHeader>
            <CardTitle>Points System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Points Earning</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Purchase: Tshs 1000</span>
                    <span className="font-bold">1 point</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Birthday bonus</span>
                    <span className="font-bold">100 points</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Referral bonus</span>
                    <span className="font-bold">250 points</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 bg-secondary/30 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Points Expiry</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Expiry period</span>
                    <span className="font-bold">24 months</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Inactive account</span>
                    <span className="font-bold">12 months</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Reactivation</span>
                    <span className="font-bold">Restore points</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm font-semibold mb-2">Program Statistics</p>
              <div className="grid gap-4 md:grid-cols-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Active Members</p>
                  <p className="text-lg font-bold">845</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total Points Issued</p>
                  <p className="text-lg font-bold">2.4M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Avg Points/Member</p>
                  <p className="text-lg font-bold">2,841</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
