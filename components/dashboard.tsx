"use client"

import { useState } from "react"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowUpRight,
  TrendingUp,
  ArrowDownRight,
  RefreshCw,
  Wallet,
  PiggyBank,
  Leaf,
  BarChart3,
  Landmark,
} from "lucide-react"
import { PortfolioChart } from "@/components/portfolio-chart"
import { InvestmentModal } from "@/components/investment-modal"
import { InvestmentDashboardSelector } from "@/components/investment-dashboards/dashboard-selector"
import { CapitalMarketsDashboard } from "@/components/capital-markets-dashboard"

export function Dashboard() {
  const [showInvestModal, setShowInvestModal] = useState(false)

  // Fix the issue with accessing properties of undefined data
  // Update the riskData object to ensure it's properly typed and initialized

  // Replace the riskData declaration with this properly typed version:
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={true} />
      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back! Here's an overview of your portfolio.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button
                size="sm"
                className="h-9 bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]"
                onClick={() => setShowInvestModal(true)}
              >
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Quick Invest
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,546.89 USDC</div>
                <p className="text-xs text-muted-foreground">+$1,234.56 (10.9%)</p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Capital Markets</CardTitle>
                <Landmark className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$4,567.89</div>
                <p className="text-xs text-muted-foreground">36.4% of portfolio</p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DeFi Investments</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$5,245.32</div>
                <p className="text-xs text-muted-foreground">41.8% of portfolio</p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Real World Assets</CardTitle>
                <PiggyBank className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,125.45</div>
                <p className="text-xs text-muted-foreground">16.9% of portfolio</p>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">ReFi Investments</CardTitle>
                <Leaf className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$608.23</div>
                <p className="text-xs text-muted-foreground">4.9% of portfolio</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-7">
            <Card className="md:col-span-4 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Portfolio Performance</CardTitle>
                <CardDescription>Combined performance across all asset classes</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PortfolioChart />
              </CardContent>
            </Card>
            <Card className="md:col-span-3 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle>Capital Markets Overview</CardTitle>
                <CardDescription>NSE and global market exposure</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-sm font-medium">NSE Index</h4>
                      <p className="text-xs text-muted-foreground">Nairobi Stock Exchange</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-[#9CCD62]">+2.4%</div>
                      <p className="text-xs text-muted-foreground">Today</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Banking Sector</span>
                      <span>45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[#9CCD62] h-2 rounded-full" style={{ width: "45%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Technology</span>
                      <span>30%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[#9CCD62] h-2 rounded-full" style={{ width: "30%" }}></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Energy</span>
                      <span>25%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-[#9CCD62] h-2 rounded-full" style={{ width: "25%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="backdrop-blur-sm bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle>Market Opportunities</CardTitle>
              <CardDescription>AI-identified investment opportunities across markets</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="capital-markets">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="capital-markets">Capital Markets</TabsTrigger>
                  <TabsTrigger value="defi">DeFi</TabsTrigger>
                  <TabsTrigger value="rwa">Real World Assets</TabsTrigger>
                </TabsList>
                <TabsContent value="capital-markets" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-background/30 rounded-lg p-4 border border-border/20">
                      <h4 className="font-medium mb-2">NSE Banking Sector</h4>
                      <p className="text-sm text-muted-foreground mb-4">Strong fundamentals and growth potential in East African banking sector</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Expected Return</span>
                        <span className="text-sm text-[#9CCD62]">12-15%</span>
                      </div>
                    </div>
                    <div className="bg-background/30 rounded-lg p-4 border border-border/20">
                      <h4 className="font-medium mb-2">Technology Growth</h4>
                      <p className="text-sm text-muted-foreground mb-4">Emerging tech companies with innovative solutions</p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Expected Return</span>
                        <span className="text-sm text-[#9CCD62]">18-22%</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="defi" className="space-y-4">
                  {/* Existing DeFi content */}
                </TabsContent>
                <TabsContent value="rwa" className="space-y-4">
                  {/* Existing RWA content */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Advanced Financial Tools */}
          <Tabs defaultValue="investments" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-6">
              <TabsTrigger value="investments" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Investment Categories</span>
              </TabsTrigger>
              <TabsTrigger value="capital-markets" className="flex items-center gap-2">
                <Landmark className="h-4 w-4" />
                <span>Capital Markets</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="investments">
              <InvestmentDashboardSelector />
            </TabsContent>

            <TabsContent value="capital-markets">
              <CapitalMarketsDashboard />
            </TabsContent>
          </Tabs>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <Button
                  className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]"
                  onClick={() => setShowInvestModal(true)}
                >
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Invest
                </Button>
                <Button variant="outline" className="w-full">
                  <ArrowDownRight className="mr-2 h-4 w-4" />
                  Withdraw
                </Button>
                <Button variant="outline" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Rebalance
                </Button>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Invested in Balanced</p>
                        <p className="text-xs text-muted-foreground">2 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+1,000 USDC</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Yield Harvested</p>
                        <p className="text-xs text-muted-foreground">5 days ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+45.32 USDC</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                        <ArrowUpRight className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Invested in Growth</p>
                        <p className="text-xs text-muted-foreground">1 week ago</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">+2,500 USDC</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#9CCD62]/10 rounded-lg border border-[#9CCD62]/20">
                    <p className="text-sm font-medium mb-1">Rebalance Opportunity</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your portfolio could benefit from a 5% shift from DeFi to RWAs for better risk-adjusted returns.
                    </p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      View Details
                    </Button>
                  </div>
                  <div className="p-3 bg-[#9CCD62]/10 rounded-lg border border-[#9CCD62]/20">
                    <p className="text-sm font-medium mb-1">New Yield Opportunity</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      A new ReFi protocol is offering 12.4% APY with moderate risk profile.
                    </p>
                    <Button variant="outline" size="sm" className="w-full text-xs h-8">
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <InvestmentModal open={showInvestModal} onOpenChange={setShowInvestModal} />
    </div>
  )
}

