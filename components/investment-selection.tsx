"use client"

import type React from "react"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpRight, Shield, BarChart3, TrendingUp, Leaf } from "lucide-react"

export function InvestmentSelection() {
  const [amount, setAmount] = useState(1000)
  const [selectedRisk, setSelectedRisk] = useState("balanced")
  const [showConfirmation, setShowConfirmation] = useState(false)

  const riskData: Record<
    string,
    {
      apy: number
      description: string
      icon: React.ElementType
      allocation: Array<{ name: string; percentage: number }>
    }
  > = {
    stable: {
      apy: 4.2,
      description: "Low risk, stable returns. Ideal for conservative investors.",
      icon: Shield,
      allocation: [
        { name: "USDC Lending", percentage: 60 },
        { name: "Stablecoin LP", percentage: 30 },
        { name: "RWA Bonds", percentage: 10 },
      ],
    },
    balanced: {
      apy: 8.7,
      description: "Moderate risk with higher returns. A balanced approach.",
      icon: BarChart3,
      allocation: [
        { name: "ETH Staking", percentage: 40 },
        { name: "DeFi Yield", percentage: 35 },
        { name: "RWA Index", percentage: 25 },
      ],
    },
    growth: {
      apy: 15.3,
      description: "Higher risk with potential for significant returns.",
      icon: TrendingUp,
      allocation: [
        { name: "DeFi Protocols", percentage: 50 },
        { name: "Liquid Staking", percentage: 30 },
        { name: "Crypto Index", percentage: 20 },
      ],
    },
    impact: {
      apy: 7.8,
      description: "Sustainable investments with positive environmental impact.",
      icon: Leaf,
      allocation: [
        { name: "Carbon Credits", percentage: 40 },
        { name: "Regenerative Finance", percentage: 35 },
        { name: "Green Energy", percentage: 25 },
      ],
    },
  }

  const selectedData = riskData[selectedRisk as keyof typeof riskData] || riskData.balanced
  const projectedYield = ((amount * selectedData.apy) / 100).toFixed(2)
  const SelectedIcon = selectedData.icon

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={true} />
      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Investment Selection</h1>
          <p className="text-muted-foreground mb-8">Choose your investment amount and risk level to get started</p>

          <div className="grid gap-8 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Investment Details</CardTitle>
                <CardDescription>Configure your investment parameters</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Investment Amount (USDC)</Label>
                  <div className="relative">
                    <Input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="pl-12 bg-background/50"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
                      USDC
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Risk Level</Label>
                  <Tabs defaultValue="balanced" onValueChange={setSelectedRisk} className="w-full">
                    <TabsList className="grid grid-cols-4 w-full">
                      <TabsTrigger value="stable">Stable</TabsTrigger>
                      <TabsTrigger value="balanced">Balanced</TabsTrigger>
                      <TabsTrigger value="growth">Growth</TabsTrigger>
                      <TabsTrigger value="impact">Impact</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                      <SelectedIcon className="h-5 w-5 text-[#9CCD62]" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {selectedRisk.charAt(0).toUpperCase() + selectedRisk.slice(1)} Portfolio
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedData.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-[#9CCD62]/10 p-4 rounded-lg">
                    <span className="text-sm font-medium">Projected APY</span>
                    <span className="text-xl font-bold text-[#9CCD62]">{selectedData.apy}%</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium"
                  onClick={() => setShowConfirmation(true)}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Invest Now
                </Button>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Portfolio Preview</CardTitle>
                <CardDescription>How your investment will be allocated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {selectedData.allocation.map((item) => (
                    <div key={item.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>{item.percentage}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-[#9CCD62] h-2 rounded-full" style={{ width: `${item.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium">Projected Annual Yield</span>
                    <span className="text-lg font-bold text-[#9CCD62]">${projectedYield} USDC</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Based on current market conditions. Actual returns may vary.
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Key Benefits</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#9CCD62]"></div>
                      </div>
                      <span>Automated yield optimization</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#9CCD62]"></div>
                      </div>
                      <span>AI-powered risk management</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#9CCD62]"></div>
                      </div>
                      <span>Withdraw anytime with no penalties</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-[#9CCD62]"></div>
                      </div>
                      <span>Real-time portfolio monitoring</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {showConfirmation && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
              <Card className="max-w-md w-full backdrop-blur-xl bg-background/80 border border-border/50">
                <CardHeader>
                  <CardTitle>Confirm Investment</CardTitle>
                  <CardDescription>Please review your investment details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Amount</span>
                    <span className="font-medium">{amount} USDC</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Risk Level</span>
                    <span className="font-medium">{selectedRisk.charAt(0).toUpperCase() + selectedRisk.slice(1)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Projected APY</span>
                    <span className="font-medium text-[#9CCD62]">{selectedData.apy}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Annual Yield</span>
                    <span className="font-medium text-[#9CCD62]">${projectedYield} USDC</span>
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button
                      className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium"
                      onClick={() => setShowConfirmation(false)}
                    >
                      Confirm Investment
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => setShowConfirmation(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

