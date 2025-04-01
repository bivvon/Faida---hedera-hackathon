"use client"

import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  LineChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ArrowUpRight, TrendingUp, AlertTriangle, Lightbulb, BarChart3, PieChart } from "lucide-react"

const performanceData = [
  { month: "Jan", yield: 4.2, benchmark: 3.8 },
  { month: "Feb", yield: 4.5, benchmark: 3.9 },
  { month: "Mar", yield: 4.3, benchmark: 3.7 },
  { month: "Apr", yield: 4.7, benchmark: 4.0 },
  { month: "May", yield: 5.1, benchmark: 4.2 },
  { month: "Jun", yield: 5.3, benchmark: 4.3 },
  { month: "Jul", yield: 5.5, benchmark: 4.5 },
  { month: "Aug", yield: 5.8, benchmark: 4.6 },
  { month: "Sep", yield: 6.0, benchmark: 4.7 },
  { month: "Oct", yield: 6.2, benchmark: 4.8 },
  { month: "Nov", yield: 6.4, benchmark: 4.9 },
  { month: "Dec", yield: 6.7, benchmark: 5.0 },
]

const riskData = [
  { category: "Volatility", value: 35, average: 50 },
  { category: "Drawdown", value: 28, average: 45 },
  { category: "Correlation", value: 42, average: 60 },
  { category: "Liquidity", value: 65, average: 55 },
  { category: "Concentration", value: 45, average: 40 },
]

export function AIInsights() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isConnected={true} />
      <main className="flex-1 container py-8">
        <div className="grid gap-8">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">AI Insights</h1>
              <p className="text-muted-foreground">Faida's AI-generated investment insights and analysis</p>
            </div>
          </div>

          <Tabs defaultValue="performance">
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="risk">Risk Analysis</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <TabsContent value="performance" className="space-y-6 pt-4">
              <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-[#9CCD62]" />
                    Yield Performance
                  </CardTitle>
                  <CardDescription>Historical yield compared to market benchmark</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={performanceData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                          dataKey="month"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length > 0 && payload[0]?.payload) {
                              return (
                                <ChartTooltip>
                                  <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                                    <div className="flex flex-col gap-2">
                                      <p className="text-sm font-medium">{payload[0]?.payload?.month || ""}</p>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#9CCD62]" />
                                        <p className="text-sm">Faida Yield: {payload[0]?.value || 0}%</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                                        <p className="text-sm">Benchmark: {payload[1]?.value || 0}%</p>
                                      </div>
                                    </div>
                                  </ChartTooltipContent>
                                </ChartTooltip>
                              )
                            }
                            return null
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="yield"
                          stroke="#9CCD62"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6, fill: "#9CCD62", stroke: "var(--background)", strokeWidth: 2 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="benchmark"
                          stroke="var(--muted-foreground)"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 6,
                            fill: "var(--muted-foreground)",
                            stroke: "var(--background)",
                            strokeWidth: 2,
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingBottom: "10px" }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <div className="mt-6 space-y-4">
                    <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">AI Analysis</h3>
                          <p className="text-sm text-muted-foreground">
                            Your portfolio has consistently outperformed the market benchmark by an average of{" "}
                            <span className="font-medium text-[#9CCD62]">1.4%</span> over the past 12 months. This
                            outperformance is primarily driven by our strategic allocation to high-yield DeFi protocols
                            and optimized rebalancing.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average APY</span>
                        <span className="font-medium text-[#9CCD62]">5.4%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Benchmark APY</span>
                        <span className="font-medium">4.3%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Outperformance</span>
                        <span className="font-medium text-[#9CCD62]">+1.1%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Sharpe Ratio</span>
                        <span className="font-medium">1.8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Max Drawdown</span>
                        <span className="font-medium">-3.2%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Top Performing Assets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                          </div>
                          <span className="text-sm">ETH Staking</span>
                        </div>
                        <span className="font-medium text-[#9CCD62]">7.2% APY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                          </div>
                          <span className="text-sm">RWA Index</span>
                        </div>
                        <span className="font-medium text-[#9CCD62]">6.8% APY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                          </div>
                          <span className="text-sm">Carbon Credits</span>
                        </div>
                        <span className="font-medium text-[#9CCD62]">5.9% APY</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center">
                            <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                          </div>
                          <span className="text-sm">DeFi Yield</span>
                        </div>
                        <span className="font-medium text-[#9CCD62]">5.5% APY</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="risk" className="space-y-6 pt-4">
              <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-[#9CCD62]" />
                    Risk Analysis
                  </CardTitle>
                  <CardDescription>Portfolio risk metrics compared to market average</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={riskData}
                        margin={{
                          top: 5,
                          right: 10,
                          left: 10,
                          bottom: 0,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                        <XAxis
                          dataKey="category"
                          stroke="var(--muted-foreground)"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length > 0 && payload[0]?.payload) {
                              return (
                                <ChartTooltip>
                                  <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                                    <div className="flex flex-col gap-2">
                                      <p className="text-sm font-medium">{payload[0]?.payload?.category || ""}</p>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#9CCD62]" />
                                        <p className="text-sm">Your Portfolio: {payload[0]?.value || 0}</p>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground" />
                                        <p className="text-sm">Market Average: {payload[1]?.value || 0}</p>
                                      </div>
                                    </div>
                                  </ChartTooltipContent>
                                </ChartTooltip>
                              )
                            }
                            return null
                          }}
                        />
                        <Bar dataKey="value" fill="#9CCD62" radius={[4, 4, 0, 0]} name="Your Portfolio" />
                        <Bar
                          dataKey="average"
                          fill="var(--muted-foreground)"
                          radius={[4, 4, 0, 0]}
                          name="Market Average"
                        />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          iconType="circle"
                          iconSize={8}
                          wrapperStyle={{ paddingBottom: "10px" }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>

                  <div className="mt-6 space-y-4">
                    <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">AI Risk Assessment</h3>
                          <p className="text-sm text-muted-foreground">
                            Your portfolio demonstrates lower volatility and drawdown risk compared to market averages,
                            while maintaining slightly higher liquidity risk. Overall, your risk-adjusted returns are
                            favorable, with a Sharpe ratio of 1.8 (above the market average of 1.2).
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-6 md:grid-cols-2">
                <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Volatility (30d)</span>
                        <span className="font-medium text-green-500">Low</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Impermanent Loss Risk</span>
                        <span className="font-medium text-green-500">Low</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Smart Contract Risk</span>
                        <span className="font-medium text-yellow-500">Medium</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Liquidity Risk</span>
                        <span className="font-medium text-yellow-500">Medium</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Overall Risk Score</span>
                        <span className="font-medium text-green-500">42/100</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                  <CardHeader>
                    <CardTitle className="text-lg">Risk Mitigation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Diversification</p>
                          <p className="text-xs text-muted-foreground">
                            Your portfolio is well-diversified across asset classes
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Protocol Selection</p>
                          <p className="text-xs text-muted-foreground">
                            Only audited protocols with strong security records
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Insurance Coverage</p>
                          <p className="text-xs text-muted-foreground">
                            65% of your portfolio is covered by DeFi insurance
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-3 h-3 rounded-full bg-[#9CCD62]"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Automated Monitoring</p>
                          <p className="text-xs text-muted-foreground">24/7 risk monitoring with automated alerts</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="suggestions" className="space-y-6 pt-4">
              <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-[#9CCD62]" />
                    AI Investment Suggestions
                  </CardTitle>
                  <CardDescription>
                    Personalized recommendations based on your portfolio and market conditions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <PieChart className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Portfolio Rebalancing Opportunity</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Our AI analysis suggests shifting 5% of your allocation from DeFi Yield to RWA Index to
                            optimize risk-adjusted returns. This adjustment could increase your projected APY by 0.4%
                            while reducing overall portfolio volatility.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                              Apply Suggestion
                            </Button>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <TrendingUp className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">New Yield Opportunity</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            A new ReFi protocol offering carbon credit tokenization has launched with an attractive
                            12.4% APY. Based on your risk profile, we recommend allocating 10% of your portfolio to this
                            opportunity to diversify your holdings and increase overall yield.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                              Invest Now
                            </Button>
                            <Button size="sm" variant="outline">
                              Learn More
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#9CCD62]/10 p-4 rounded-lg border border-[#9CCD62]/20">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                          <ArrowUpRight className="h-5 w-5 text-[#9CCD62]" />
                        </div>
                        <div>
                          <h3 className="font-medium mb-1">Deposit Opportunity</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            Market conditions are favorable for increasing your position in ETH staking. With the
                            upcoming network upgrade, staking rewards are projected to increase by 15-20%. We recommend
                            adding to your ETH staking position to capitalize on this opportunity.
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                              Add Funds
                            </Button>
                            <Button size="sm" variant="outline">
                              View Analysis
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/50 border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Market Insights</CardTitle>
                  <CardDescription>AI-generated analysis of current market conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">DeFi Yield Trends</p>
                        <p className="text-xs text-muted-foreground">
                          DeFi yields have stabilized after recent market volatility. Lending protocols are showing
                          consistent returns between 4-6% APY, while liquidity provision is yielding 8-12% APY with
                          moderate impermanent loss risk.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">RWA Market Update</p>
                        <p className="text-xs text-muted-foreground">
                          Real World Assets on-chain are gaining institutional adoption, with tokenized treasury bonds
                          and real estate showing increased trading volume. This sector is projected to grow by 35% in
                          the next quarter.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Regulatory Landscape</p>
                        <p className="text-xs text-muted-foreground">
                          Recent regulatory developments are creating a more favorable environment for compliant DeFi
                          protocols. This may lead to increased institutional capital inflows and potentially higher
                          yields in the medium term.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                      <div className="w-8 h-8 rounded-full bg-[#9CCD62]/20 flex items-center justify-center shrink-0 mt-0.5">
                        <Lightbulb className="h-4 w-4 text-[#9CCD62]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">Emerging Opportunities</p>
                        <p className="text-xs text-muted-foreground">
                          The ReFi (Regenerative Finance) sector is showing promising growth with carbon credit
                          tokenization and biodiversity assets gaining traction. Early adopters may benefit from higher
                          yields as this market matures.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

