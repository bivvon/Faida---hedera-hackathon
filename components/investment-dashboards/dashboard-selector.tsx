"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Globe, Leaf } from "lucide-react"
import { DefiDashboard } from "@/components/investment-dashboards/defi-dashboard"
import { RwaDashboard } from "@/components/investment-dashboards/rwa-dashboard"
import { RefiDashboard } from "@/components/investment-dashboards/refi-dashboard"

export function InvestmentDashboardSelector() {
  const [activeTab, setActiveTab] = useState("defi")

  return (
    <Card className="backdrop-blur-sm bg-background/50 border-border/50">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Investment Categories</CardTitle>
        <CardDescription>
          Explore your investments across different categories and track their performance
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs defaultValue="defi" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full rounded-none border-b border-border/50">
            <TabsTrigger
              value="defi"
              className="flex items-center gap-2 data-[state=active]:bg-[#9CCD62]/10 data-[state=active]:text-[#9CCD62]"
            >
              <TrendingUp className="h-4 w-4" />
              <span>DeFi Investments</span>
            </TabsTrigger>
            <TabsTrigger
              value="rwa"
              className="flex items-center gap-2 data-[state=active]:bg-[#9CCD62]/10 data-[state=active]:text-[#9CCD62]"
            >
              <Globe className="h-4 w-4" />
              <span>Real World Assets</span>
            </TabsTrigger>
            <TabsTrigger
              value="refi"
              className="flex items-center gap-2 data-[state=active]:bg-[#9CCD62]/10 data-[state=active]:text-[#9CCD62]"
            >
              <Leaf className="h-4 w-4" />
              <span>ReFi Investments</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="defi" className="m-0">
            <DefiDashboard />
          </TabsContent>

          <TabsContent value="rwa" className="m-0">
            <RwaDashboard />
          </TabsContent>

          <TabsContent value="refi" className="m-0">
            <RefiDashboard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

