"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { RefreshCw, AlertTriangle, TrendingUp, Zap, Shield, Info, ArrowRight } from "lucide-react"

// DeFi protocols data
const defiProtocols = [
  {
    id: 1,
    name: "Aave Lending",
    apy: 4.8,
    risk: "Low",
    tvl: "$2.4B",
    allocation: 35,
    color: "#9CCD62",
    pulse: true,
    description: "Lending platform with multiple asset support",
    trend: "up",
    change: "+0.2%",
  },
  {
    id: 2,
    name: "Curve Finance",
    apy: 6.2,
    risk: "Medium",
    tvl: "$1.8B",
    allocation: 25,
    color: "#FFB547",
    pulse: false,
    description: "Stablecoin exchange liquidity pool",
    trend: "down",
    change: "-0.1%",
  },
  {
    id: 3,
    name: "Lido Staking",
    apy: 3.9,
    risk: "Low",
    tvl: "$8.7B",
    allocation: 20,
    color: "#4ECDC4",
    pulse: false,
    description: "Liquid staking derivatives protocol",
    trend: "up",
    change: "+0.3%",
  },
  {
    id: 4,
    name: "Uniswap V3",
    apy: 8.5,
    risk: "Medium-High",
    tvl: "$3.2B",
    allocation: 15,
    color: "#FF6B6B",
    pulse: true,
    description: "Concentrated liquidity AMM protocol",
    trend: "up",
    change: "+1.2%",
  },
  {
    id: 5,
    name: "Compound",
    apy: 5.1,
    risk: "Medium",
    tvl: "$1.5B",
    allocation: 5,
    color: "#845EC2",
    pulse: false,
    description: "Algorithmic money market protocol",
    trend: "down",
    change: "-0.3%",
  },
]

// Historical yield data
const yieldData = [
  { month: "Jan", yield: 4.2 },
  { month: "Feb", yield: 4.5 },
  { month: "Mar", yield: 4.3 },
  { month: "Apr", yield: 4.7 },
  { month: "May", yield: 5.1 },
  { month: "Jun", yield: 5.3 },
  { month: "Jul", yield: 5.5 },
  { month: "Aug", yield: 5.8 },
  { month: "Sep", yield: 6.0 },
  { month: "Oct", yield: 6.2 },
  { month: "Nov", yield: 6.4 },
  { month: "Dec", yield: 6.7 },
]

// Risk exposure data
const riskData = [
  { name: "Smart Contract", value: 35 },
  { name: "Liquidity", value: 25 },
  { name: "Market", value: 20 },
  { name: "Oracle", value: 15 },
  { name: "Regulatory", value: 5 },
]

// Rebalance suggestions
const rebalanceSuggestions = [
  { from: "Curve Finance", to: "Aave Lending", amount: "5%", reason: "Lower risk profile with similar yield" },
  { from: "Uniswap V3", to: "Lido Staking", amount: "3%", reason: "Reduce volatility exposure" },
]

const COLORS = ["#9CCD62", "#FFB547", "#4ECDC4", "#FF6B6B", "#845EC2"]

export function DefiDashboard() {
  const [hoveredProtocol, setHoveredProtocol] = useState<number | null>(null)
  const [showRebalance, setShowRebalance] = useState(false)

  const totalApy = defiProtocols
    .reduce((sum, protocol) => sum + (protocol.apy * protocol.allocation) / 100, 0)
    .toFixed(2)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#9CCD62]" />
            The Yield Nexus
          </h2>
          <p className="text-muted-foreground">Your DeFi investment portfolio with real-time yield tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#9CCD62]/20 text-[#9CCD62] border-[#9CCD62]/20 px-3 py-1.5">
            <Zap className="mr-1 h-3.5 w-3.5" />
            {totalApy}% Weighted APY
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Protocol Network Visualization */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Protocol Network</CardTitle>
            <CardDescription>Interactive visualization of your DeFi investments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[350px] w-full bg-background/30 rounded-lg border border-border/50 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-[300px] h-[300px]">
                  {/* Center node */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-[#9CCD62]/20 flex items-center justify-center z-10 border-2 border-[#9CCD62]">
                    <Shield className="h-8 w-8 text-[#9CCD62]" />
                  </div>

                  {/* Protocol nodes */}
                  {defiProtocols.map((protocol, index) => {
                    const angle = index * (360 / defiProtocols.length) * (Math.PI / 180)
                    const radius = 120
                    const x = radius * Math.cos(angle) + 150 - 30
                    const y = radius * Math.sin(angle) + 150 - 30

                    return (
                      <TooltipProvider key={protocol.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`absolute w-[60px] h-[60px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border-2 ${hoveredProtocol === protocol.id ? "scale-110" : ""} ${protocol.pulse ? "animate-pulse" : ""}`}
                              style={{
                                left: `${x}px`,
                                top: `${y}px`,
                                backgroundColor: `${protocol.color}20`,
                                borderColor: protocol.color,
                              }}
                              onMouseEnter={() => setHoveredProtocol(protocol.id)}
                              onMouseLeave={() => setHoveredProtocol(null)}
                            >
                              <div className="text-center">
                                <div className="text-xs font-bold" style={{ color: protocol.color }}>
                                  {protocol.apy}%
                                </div>
                                <div className="text-[10px] leading-tight">{protocol.allocation}%</div>
                              </div>

                              {/* Connection line to center */}
                              <svg
                                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                                style={{ zIndex: -1 }}
                              >
                                <line
                                  x1="30"
                                  y1="30"
                                  x2="150"
                                  y2="150"
                                  stroke={protocol.color}
                                  strokeWidth={hoveredProtocol === protocol.id ? "3" : "1.5"}
                                  strokeDasharray={hoveredProtocol === protocol.id ? "none" : "5,5"}
                                  opacity={hoveredProtocol === protocol.id ? "0.8" : "0.4"}
                                />
                              </svg>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-[250px]">
                            <div className="space-y-2">
                              <div className="font-bold" style={{ color: protocol.color }}>
                                {protocol.name}
                              </div>
                              <div className="text-xs">{protocol.description}</div>
                              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                <div className="text-muted-foreground">APY:</div>
                                <div className="font-medium flex items-center">
                                  {protocol.apy}%
                                  <span
                                    className={`ml-1 text-[10px] ${protocol.trend === "up" ? "text-green-500" : "text-red-500"}`}
                                  >
                                    {protocol.change}
                                  </span>
                                </div>
                                <div className="text-muted-foreground">Risk:</div>
                                <div className="font-medium">{protocol.risk}</div>
                                <div className="text-muted-foreground">TVL:</div>
                                <div className="font-medium">{protocol.tvl}</div>
                                <div className="text-muted-foreground">Allocation:</div>
                                <div className="font-medium">{protocol.allocation}%</div>
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="absolute bottom-3 right-3 bg-background/70 backdrop-blur-sm p-2 rounded-md border border-border/50">
                <div className="text-xs font-medium mb-1">Protocol Legend</div>
                <div className="space-y-1">
                  {defiProtocols.map((protocol) => (
                    <div key={protocol.id} className="flex items-center gap-1.5 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: protocol.color }}></div>
                      <div className="truncate max-w-[100px]">{protocol.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
            <CardDescription>Current distribution across protocols</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defiProtocols}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="allocation"
                    nameKey="name"
                  >
                    {defiProtocols.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0 && payload[0]?.payload) {
                        const data = payload[0].payload
                        return (
                          <div className="bg-background/90 backdrop-blur-sm p-2 rounded-md border border-border/50 text-sm">
                            <div className="font-medium">{data.name}</div>
                            <div>Allocation: {data.allocation}%</div>
                            <div>APY: {data.apy}%</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 space-y-3">
              <Button
                variant="outline"
                className="w-full bg-[#9CCD62]/10 border-[#9CCD62]/20 hover:bg-[#9CCD62]/20 text-foreground"
                onClick={() => setShowRebalance(!showRebalance)}
              >
                <RefreshCw className="mr-2 h-4 w-4 text-[#9CCD62]" />
                Suggest Rebalance
              </Button>

              {showRebalance && (
                <div className="bg-background/70 backdrop-blur-sm p-3 rounded-md border border-[#9CCD62]/30 space-y-3">
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-[#9CCD62]" />
                    AI Rebalance Suggestions
                  </div>

                  {rebalanceSuggestions.map((suggestion, index) => (
                    <div key={index} className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{suggestion.from}</span>
                        <ArrowRight className="h-3 w-3" />
                        <span className="font-medium">{suggestion.to}</span>
                        <Badge className="ml-auto text-[10px] py-0 h-4">{suggestion.amount}</Badge>
                      </div>
                      <div className="text-muted-foreground">{suggestion.reason}</div>
                    </div>
                  ))}

                  <Button size="sm" className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42] mt-2">
                    Apply Suggestions
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Yield and Risk Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Historical Yield Performance</CardTitle>
            <CardDescription>Monthly APY trends across your DeFi portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yieldData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0) {
                        return (
                          <ChartTooltip>
                            <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                              <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">{label}</p>
                                <p className="text-lg font-bold text-[#9CCD62]">{payload[0].value}% APY</p>
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
                    strokeWidth={3}
                    dot={{ fill: "#9CCD62", r: 4 }}
                    activeDot={{ r: 6, fill: "#9CCD62", stroke: "var(--background)", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Risk Exposure Analysis</CardTitle>
            <CardDescription>Breakdown of risk factors in your DeFi portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={riskData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--border)" />
                  <XAxis
                    type="number"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="var(--muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <RechartsTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length > 0) {
                        const riskLevel = payload[0].value <= 25 ? "Low" : payload[0].value <= 50 ? "Medium" : "High"
                        const riskColor =
                          payload[0].value <= 25
                            ? "text-green-500"
                            : payload[0].value <= 50
                              ? "text-yellow-500"
                              : "text-red-500"

                        return (
                          <ChartTooltip>
                            <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                              <div className="flex flex-col gap-2">
                                <p className="text-sm font-medium">{label} Risk</p>
                                <div className="flex items-center gap-2">
                                  <p className="text-lg font-bold">{payload[0].value}%</p>
                                  <Badge className={`${riskColor} bg-transparent`}>{riskLevel}</Badge>
                                </div>
                              </div>
                            </ChartTooltipContent>
                          </ChartTooltip>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#9CCD62" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="mt-4 p-3 bg-[#FFB547]/10 rounded-md border border-[#FFB547]/30 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-[#FFB547] shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium mb-1">Risk Assessment</p>
                <p className="text-muted-foreground text-xs">
                  Your portfolio has a moderate risk profile with smart contract risk being the highest factor. Consider
                  diversifying across more protocols to reduce exposure.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Protocol Details */}
      <Card className="backdrop-blur-sm bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Protocol Performance Details</CardTitle>
          <CardDescription>Detailed breakdown of each DeFi protocol in your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {defiProtocols.map((protocol) => (
              <div
                key={protocol.id}
                className="p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="md:w-1/4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${protocol.color}20`, borderColor: protocol.color }}
                      >
                        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: protocol.color }}></div>
                      </div>
                      <div>
                        <h3 className="font-medium">{protocol.name}</h3>
                        <p className="text-xs text-muted-foreground">{protocol.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/4 grid grid-cols-2 gap-x-4 gap-y-2">
                    <div className="text-sm text-muted-foreground">Current APY:</div>
                    <div className="text-sm font-medium flex items-center">
                      {protocol.apy}%
                      <span className={`ml-1 text-xs ${protocol.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                        {protocol.change}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">Risk Level:</div>
                    <div className="text-sm font-medium">{protocol.risk}</div>
                  </div>

                  <div className="md:w-1/4">
                    <div className="text-sm text-muted-foreground mb-1">Allocation: {protocol.allocation}%</div>
                    <Progress value={protocol.allocation} className="h-2" indicatorClassName="bg-[#9CCD62]" />
                  </div>

                  <div className="md:w-1/4 flex justify-end">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Info className="h-3.5 w-3.5" />
                            <span>Details</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent side="left" className="max-w-[300px]">
                          <div className="space-y-2">
                            <div className="font-medium">{protocol.name} Details</div>
                            <div className="text-xs">
                              <p>Total Value Locked: {protocol.tvl}</p>
                              <p>Protocol Security: Audited by multiple firms</p>
                              <p>
                                Impermanent Loss Risk:{" "}
                                {protocol.risk === "Low"
                                  ? "Minimal"
                                  : protocol.risk === "Medium"
                                    ? "Moderate"
                                    : "Significant"}
                              </p>
                              <p>
                                Recommended for:{" "}
                                {protocol.risk === "Low"
                                  ? "Conservative investors"
                                  : protocol.risk === "Medium"
                                    ? "Balanced portfolios"
                                    : "Growth-focused strategies"}
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="backdrop-blur-sm bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#9CCD62]" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Smart recommendations to optimize your DeFi portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#9CCD62]/30 bg-[#9CCD62]/10">
              <h3 className="font-medium mb-2">Yield Optimization Opportunity</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Based on current market conditions, shifting 5% of your allocation from Uniswap V3 to Aave Lending could
                reduce your risk profile shifting 5% of your allocation from Uniswap V3 to Aave Lending could reduce
                your risk profile while maintaining similar yield. This adjustment would optimize your risk-adjusted
                returns and provide more stability during market volatility.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                  Apply Suggestion
                </Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-[#9CCD62]/30 bg-[#9CCD62]/10">
              <h3 className="font-medium mb-2">Market Trend Alert</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI has detected increasing yields in ETH staking protocols due to upcoming network upgrades.
                Consider increasing your allocation to Lido Staking to capitalize on this trend over the next 3-6
                months.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                  Adjust Allocation
                </Button>
                <Button size="sm" variant="outline">
                  View Analysis
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

