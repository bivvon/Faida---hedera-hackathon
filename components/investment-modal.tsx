"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface InvestmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function InvestmentModal({ open, onOpenChange }: InvestmentModalProps) {
  const [amount, setAmount] = useState(1000)
  const [selectedRisk, setSelectedRisk] = useState("balanced")

  const riskData: Record<
    string,
    {
      apy: number
      allocation: Array<{ name: string; percentage: number }>
    }
  > = {
    stable: {
      apy: 4.2,
      allocation: [
        { name: "USDC Lending", percentage: 60 },
        { name: "Stablecoin LP", percentage: 30 },
        { name: "RWA Bonds", percentage: 10 },
      ],
    },
    balanced: {
      apy: 8.7,
      allocation: [
        { name: "ETH Staking", percentage: 40 },
        { name: "DeFi Yield", percentage: 35 },
        { name: "RWA Index", percentage: 25 },
      ],
    },
    growth: {
      apy: 15.3,
      allocation: [
        { name: "DeFi Protocols", percentage: 50 },
        { name: "Liquid Staking", percentage: 30 },
        { name: "Crypto Index", percentage: 20 },
      ],
    },
    impact: {
      apy: 7.8,
      allocation: [
        { name: "Carbon Credits", percentage: 40 },
        { name: "Regenerative Finance", percentage: 35 },
        { name: "Green Energy", percentage: 25 },
      ],
    },
  }

  const selectedData = riskData[selectedRisk as keyof typeof riskData] || riskData.balanced
  const projectedYield = ((amount * selectedData.apy) / 100).toFixed(2)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/80 border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Invest in Faida</DialogTitle>
          <DialogDescription>Choose your investment amount and risk level</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Investment Amount (USDC)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="bg-background/50"
            />
          </div>
          <div className="grid gap-2">
            <Label>Risk Level</Label>
            <Tabs defaultValue="balanced" onValueChange={setSelectedRisk}>
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="stable">Stable</TabsTrigger>
                <TabsTrigger value="balanced">Balanced</TabsTrigger>
                <TabsTrigger value="growth">Growth</TabsTrigger>
                <TabsTrigger value="impact">Impact</TabsTrigger>
              </TabsList>
              <TabsContent value="stable" className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Projected APY</span>
                  <span className="text-sm font-bold text-[#9CCD62]">4.2%</span>
                </div>
              </TabsContent>
              <TabsContent value="balanced" className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Projected APY</span>
                  <span className="text-sm font-bold text-[#9CCD62]">8.7%</span>
                </div>
              </TabsContent>
              <TabsContent value="growth" className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Projected APY</span>
                  <span className="text-sm font-bold text-[#9CCD62]">15.3%</span>
                </div>
              </TabsContent>
              <TabsContent value="impact" className="mt-4 space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Projected APY</span>
                  <span className="text-sm font-bold text-[#9CCD62]">7.8%</span>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2 mt-2">
            <Label>Portfolio Allocation</Label>
            <div className="space-y-3">
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
          </div>

          <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Projected Annual Yield</span>
              <span className="text-lg font-bold text-[#9CCD62]">${projectedYield} USDC</span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] font-medium"
            onClick={() => onOpenChange(false)}
          >
            Invest Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

