"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Globe,
  Building,
  Zap,
  PiggyBank,
  TrendingUp,
  Landmark,
  Home,
  Factory,
  ShoppingBag,
  Users,
  BarChart3,
  Info,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

// RWA investments data
const rwaInvestments = [
  {
    id: 1,
    name: "Kenya Huduma Fund",
    type: "Infrastructure",
    country: "Kenya",
    region: "Africa",
    coordinates: { lat: 1.2921, lng: 36.8219 },
    apy: 6.2,
    risk: "Medium",
    allocation: 30,
    color: "#4ECDC4",
    impact: "High",
    impactMetric: "2.5M people served",
    description: "Public infrastructure development fund",
    trend: "up",
    change: "+0.3%",
    icon: Building,
  },
  {
    id: 2,
    name: "Solar Microgrids Uganda",
    type: "Energy",
    country: "Uganda",
    region: "Africa",
    coordinates: { lat: 0.3476, lng: 32.5825 },
    apy: 7.8,
    risk: "Medium-High",
    allocation: 25,
    color: "#FFB547",
    impact: "Very High",
    impactMetric: "12,000 homes powered",
    description: "Renewable energy infrastructure",
    trend: "up",
    change: "+0.5%",
    icon: Factory,
  },
  {
    id: 3,
    name: "African Agritech Bonds",
    type: "Agriculture",
    country: "Multiple",
    region: "Africa",
    coordinates: { lat: 9.145, lng: 18.4277 },
    apy: 5.4,
    risk: "Medium",
    allocation: 20,
    color: "#9CCD62",
    impact: "High",
    impactMetric: "8,500 farmers supported",
    description: "Agricultural technology financing",
    trend: "down",
    change: "-0.2%",
    icon: Landmark,
  },
  {
    id: 4,
    name: "Ghana Housing Development",
    type: "Real Estate",
    country: "Ghana",
    region: "Africa",
    coordinates: { lat: 7.9465, lng: -1.0232 },
    apy: 6.5,
    risk: "Medium",
    allocation: 15,
    color: "#FF6B6B",
    impact: "Medium",
    impactMetric: "1,200 affordable homes",
    description: "Affordable housing projects",
    trend: "up",
    change: "+0.1%",
    icon: Home,
  },
  {
    id: 5,
    name: "Nigeria SME Fund",
    type: "Business",
    country: "Nigeria",
    region: "Africa",
    coordinates: { lat: 9.082, lng: 8.6753 },
    apy: 8.2,
    risk: "High",
    allocation: 10,
    color: "#845EC2",
    impact: "Medium-High",
    impactMetric: "350 businesses funded",
    description: "Small business development fund",
    trend: "up",
    change: "+0.7%",
    icon: PiggyBank,
  },
]

// New RWA Marketplace Listings
const rwaListings = [
  {
    id: 1,
    name: "Kick Tower",
    location: "Nairobi, Kenya",
    type: "Commercial Real Estate",
    totalValue: 25000000,
    minInvestment: 100,
    apy: 8.4,
    funded: 68,
    image: "/placeholder.svg?height=200&width=300",
    description: "Premium office tower in Nairobi's financial district with long-term corporate tenants.",
    highlights: [
      "Grade A office space with 98% occupancy",
      "15-year lease agreements with multinational corporations",
      "LEED Gold certified sustainable building",
      "Quarterly dividend distributions",
    ],
    tokenSymbol: "KICK",
    totalTokens: 250000,
    pricePerToken: 100,
    risk: "Medium",
    term: "10 years",
    liquidity: "Secondary market trading available",
    documents: ["Offering Memorandum", "Legal Structure", "Financial Projections", "Audit Reports"],
  },
  {
    id: 2,
    name: "Lagos Port Expansion",
    location: "Lagos, Nigeria",
    type: "Infrastructure",
    totalValue: 40000000,
    minInvestment: 500,
    apy: 7.2,
    funded: 42,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Strategic port expansion project to increase cargo handling capacity and improve logistics efficiency.",
    highlights: [
      "Government-backed infrastructure project",
      "Revenue from port fees and logistics services",
      "25-year concession agreement",
      "Semi-annual yield distributions",
    ],
    tokenSymbol: "LPEX",
    totalTokens: 400000,
    pricePerToken: 100,
    risk: "Medium-Low",
    term: "25 years",
    liquidity: "Limited secondary market trading",
    documents: ["Project Overview", "Government Concession", "Financial Models", "Environmental Impact Assessment"],
  },
  {
    id: 3,
    name: "Accra Green Apartments",
    location: "Accra, Ghana",
    type: "Residential Real Estate",
    totalValue: 12000000,
    minInvestment: 250,
    apy: 9.1,
    funded: 85,
    image: "/placeholder.svg?height=200&width=300",
    description: "Eco-friendly residential apartment complex with solar power and rainwater harvesting systems.",
    highlights: [
      "100 luxury apartments in prime location",
      "Solar-powered with 60% energy self-sufficiency",
      "Strong rental demand from expatriates and professionals",
      "Monthly rental income distributions",
    ],
    tokenSymbol: "AGAP",
    totalTokens: 120000,
    pricePerToken: 100,
    risk: "Medium",
    term: "8 years",
    liquidity: "Active secondary market",
    documents: ["Property Details", "Rental Projections", "Management Agreement", "Title Documents"],
  },
  {
    id: 4,
    name: "East Africa Logistics Network",
    location: "Multiple Countries",
    type: "Transportation",
    totalValue: 30000000,
    minInvestment: 1000,
    apy: 10.5,
    funded: 31,
    image: "/placeholder.svg?height=200&width=300",
    description:
      "Integrated logistics network connecting major East African cities with modern transportation infrastructure.",
    highlights: [
      "Fleet of 200 electric trucks and 5 distribution centers",
      "Contracts with major e-commerce and retail companies",
      "Proprietary route optimization technology",
      "Quarterly dividend payments",
    ],
    tokenSymbol: "EALN",
    totalTokens: 300000,
    pricePerToken: 100,
    risk: "Medium-High",
    term: "12 years",
    liquidity: "Limited secondary market",
    documents: ["Business Plan", "Fleet Details", "Client Contracts", "Technology Overview"],
  },
]

// Historical performance data
const performanceData = [
  { month: "Jan", value: 100 },
  { month: "Feb", value: 102 },
  { month: "Mar", value: 104 },
  { month: "Apr", value: 103 },
  { month: "May", value: 105 },
  { month: "Jun", value: 108 },
  { month: "Jul", value: 110 },
  { month: "Aug", value: 112 },
  { month: "Sep", value: 115 },
  { month: "Oct", value: 118 },
  { month: "Nov", value: 120 },
  { month: "Dec", value: 123 },
]

// Impact metrics data
const impactData = [
  { category: "Environmental", value: 72 },
  { category: "Social", value: 85 },
  { category: "Governance", value: 68 },
  { category: "Community", value: 90 },
]

const COLORS = ["#4ECDC4", "#FFB547", "#9CCD62", "#FF6B6B", "#845EC2"]

export function RwaDashboard() {
  const [selectedInvestment, setSelectedInvestment] = useState<number | null>(null)
  const [globeLoaded, setGlobeLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState("portfolio")
  const [selectedListing, setSelectedListing] = useState<number | null>(null)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [purchaseAmount, setPurchaseAmount] = useState(1000)
  const [purchaseTokens, setPurchaseTokens] = useState(10)
  const [purchaseSuccess, setShowPurchaseSuccess] = useState(false)

  // Simulate globe loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobeLoaded(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const totalApy = rwaInvestments
    .reduce((sum, investment) => sum + (investment.apy * investment.allocation) / 100, 0)
    .toFixed(2)

  // Handle listing selection
  const handleListingSelect = (id: number) => {
    setSelectedListing(id)
    setShowPurchaseModal(true)
  }

  // Handle purchase
  const handlePurchase = () => {
    // Simulate purchase processing
    setTimeout(() => {
      setShowPurchaseModal(false)
      setShowPurchaseSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowPurchaseSuccess(false)
      }, 3000)
    }, 1500)
  }

  // Update tokens based on amount
  const updateTokensFromAmount = (amount: number) => {
    if (!selectedListing) return

    const listing = rwaListings.find((l) => l.id === selectedListing)
    if (!listing) return

    const tokens = Math.floor(amount / listing.pricePerToken)
    setPurchaseTokens(tokens)
  }

  // Update amount based on tokens
  const updateAmountFromTokens = (tokens: number) => {
    if (!selectedListing) return

    const listing = rwaListings.find((l) => l.id === selectedListing)
    if (!listing) return

    const amount = tokens * listing.pricePerToken
    setPurchaseAmount(amount)
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-[#4ECDC4]" />
            The Tokenized Earth
          </h2>
          <p className="text-muted-foreground">Your real-world asset investments with global impact tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#4ECDC4]/20 text-[#4ECDC4] border-[#4ECDC4]/20 px-3 py-1.5">
            <TrendingUp className="mr-1 h-3.5 w-3.5" />
            {totalApy}% Weighted APY
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <Zap className="h-4 w-4" />
            Impact Report
          </Button>
        </div>
      </div>

      {/* Success Message */}
      {purchaseSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/90 text-white p-4 rounded-lg shadow-lg flex items-center gap-3 animate-fadeIn">
          <CheckCircle className="h-5 w-5" />
          <div>
            <p className="font-medium">Purchase Successful!</p>
            <p className="text-sm">Your RWA tokens have been added to your portfolio</p>
          </div>
        </div>
      )}

      {/* Tabs for Portfolio and Marketplace */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>My RWA Portfolio</span>
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            <span>RWA Marketplace</span>
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Tab */}
        <TabsContent value="portfolio" className="space-y-6 pt-4">
          {/* 3D Globe Visualization */}
          <div className="grid gap-6 md:grid-cols-12">
            <Card className="md:col-span-8 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Global Investment Map</CardTitle>
                <CardDescription>Interactive visualization of your RWA investments worldwide</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[400px] w-full bg-background/30 rounded-lg border border-border/50 overflow-hidden">
                  {!globeLoaded ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin h-8 w-8 border-2 border-[#4ECDC4] border-t-transparent rounded-full"></div>
                    </div>
                  ) : (
                    <div className="absolute inset-0">
                      {/* Simplified globe visualization */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-[300px] h-[300px]">
                          {/* Globe background */}
                          <div className="absolute inset-0 rounded-full bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 animate-pulse"></div>

                          {/* Continent outlines - simplified */}
                          <div className="absolute inset-0 rounded-full overflow-hidden">
                            <svg viewBox="0 0 200 200" className="w-full h-full opacity-30">
                              <path
                                d="M100,30 Q130,50 120,80 Q140,100 120,130 Q100,150 80,130 Q60,100 80,80 Q70,50 100,30"
                                fill="none"
                                stroke="#4ECDC4"
                                strokeWidth="1"
                              />
                              <path
                                d="M130,60 Q150,80 140,110 Q160,130 130,150"
                                fill="none"
                                stroke="#4ECDC4"
                                strokeWidth="1"
                              />
                              <path
                                d="M70,60 Q50,80 60,110 Q40,130 70,150"
                                fill="none"
                                stroke="#4ECDC4"
                                strokeWidth="1"
                              />
                            </svg>
                          </div>

                          {/* Investment markers */}
                          {rwaInvestments.map((investment) => {
                            // Convert lat/lng to x,y coordinates (simplified)
                            const x =
                              150 +
                              Math.cos((investment.coordinates.lng * Math.PI) / 180) *
                                Math.cos((investment.coordinates.lat * Math.PI) / 180) *
                                100
                            const y = 150 + Math.sin((investment.coordinates.lat * Math.PI) / 180) * 100

                            return (
                              <TooltipProvider key={investment.id}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div
                                      className={`absolute w-[40px] h-[40px] rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 -translate-x-1/2 -translate-y-1/2 ${selectedInvestment === investment.id ? "scale-125 z-10" : ""}`}
                                      style={{
                                        left: `${x}px`,
                                        top: `${y}px`,
                                        backgroundColor: `${investment.color}20`,
                                        borderColor: investment.color,
                                        border: `2px solid ${investment.color}`,
                                      }}
                                      onClick={() =>
                                        setSelectedInvestment(
                                          investment.id === selectedInvestment ? null : investment.id,
                                        )
                                      }
                                    >
                                      <investment.icon className="h-5 w-5" style={{ color: investment.color }} />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-[250px]">
                                    <div className="space-y-2">
                                      <div className="font-bold" style={{ color: investment.color }}>
                                        {investment.name}
                                      </div>
                                      <div className="text-xs">{investment.description}</div>
                                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                                        <div className="text-muted-foreground">Country:</div>
                                        <div className="font-medium">{investment.country}</div>
                                        <div className="text-muted-foreground">Type:</div>
                                        <div className="font-medium">{investment.type}</div>
                                        <div className="text-muted-foreground">APY:</div>
                                        <div className="font-medium flex items-center">
                                          {investment.apy}%
                                          <span
                                            className={`ml-1 text-[10px] ${investment.trend === "up" ? "text-green-500" : "text-red-500"}`}
                                          >
                                            {investment.change}
                                          </span>
                                        </div>
                                        <div className="text-muted-foreground">Impact:</div>
                                        <div className="font-medium">{investment.impact}</div>
                                      </div>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            )
                          })}
                        </div>
                      </div>

                      {/* Selected investment details */}
                      {selectedInvestment && (
                        <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur-sm p-3 rounded-md border border-border/50">
                          {rwaInvestments
                            .filter((i) => i.id === selectedInvestment)
                            .map((investment) => (
                              <div key={investment.id} className="flex flex-col md:flex-row gap-4">
                                <div className="md:w-1/3">
                                  <h3 className="font-medium" style={{ color: investment.color }}>
                                    {investment.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground">
                                    {investment.description} in {investment.country}
                                  </p>
                                </div>
                                <div className="md:w-1/3">
                                  <div className="text-xs text-muted-foreground">Impact Metric</div>
                                  <div className="text-sm font-medium">{investment.impactMetric}</div>
                                </div>
                                <div className="md:w-1/3">
                                  <div className="text-xs text-muted-foreground">Performance</div>
                                  <div className="text-sm font-medium flex items-center">
                                    {investment.apy}% APY
                                    <span
                                      className={`ml-1 text-xs ${investment.trend === "up" ? "text-green-500" : "text-red-500"}`}
                                    >
                                      {investment.change}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Legend */}
                  <div className="absolute top-3 right-3 bg-background/70 backdrop-blur-sm p-2 rounded-md border border-border/50">
                    <div className="text-xs font-medium mb-1">Investment Types</div>
                    <div className="space-y-1">
                      {Array.from(new Set(rwaInvestments.map((i) => i.type))).map((type, index) => (
                        <div key={index} className="flex items-center gap-1.5 text-xs">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <div>{type}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-4 backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Impact Metrics</CardTitle>
                <CardDescription>ESG performance of your RWA portfolio</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {impactData.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{item.category} Impact</span>
                        <span className="text-sm font-medium">{item.value}/100</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full"
                          style={{
                            width: `${item.value}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-3 bg-[#4ECDC4]/10 rounded-md border border-[#4ECDC4]/30">
                  <h3 className="text-sm font-medium mb-2">Overall Impact Score</h3>
                  <div className="flex items-center justify-between">
                    <div className="text-3xl font-bold text-[#4ECDC4]">
                      {Math.round(impactData.reduce((sum, item) => sum + item.value, 0) / impactData.length)}
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Excellent</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Your RWA portfolio is in the top 15% of impact investors on our platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance and Allocation */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Performance History</CardTitle>
                <CardDescription>Value growth of your RWA investments over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                        domain={[95, "dataMax + 5"]}
                        tickFormatter={(value) => `${value}`}
                      />
                      <RechartsTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length > 0) {
                            const baseValue = 100
                            const currentValue = payload[0].value as number
                            const percentChange = (((currentValue - baseValue) / baseValue) * 100).toFixed(1)

                            return (
                              <ChartTooltip>
                                <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                                  <div className="flex flex-col gap-2">
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-lg font-bold">Value: {currentValue}</p>
                                    <p className="text-sm text-green-500">+{percentChange}% from start</p>
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
                        dataKey="value"
                        stroke="#4ECDC4"
                        strokeWidth={3}
                        dot={{ fill: "#4ECDC4", r: 4 }}
                        activeDot={{ r: 6, fill: "#4ECDC4", stroke: "var(--background)", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-md bg-background/50">
                    <div className="text-xs text-muted-foreground">1Y Return</div>
                    <div className="text-lg font-medium text-green-500">+23%</div>
                  </div>
                  <div className="p-2 rounded-md bg-background/50">
                    <div className="text-xs text-muted-foreground">Volatility</div>
                    <div className="text-lg font-medium">Low</div>
                  </div>
                  <div className="p-2 rounded-md bg-background/50">
                    <div className="text-xs text-muted-foreground">Sharpe Ratio</div>
                    <div className="text-lg font-medium">1.8</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-background/50 border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Portfolio Allocation</CardTitle>
                <CardDescription>Distribution across RWA investment types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rwaInvestments}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="allocation"
                        nameKey="name"
                      >
                        {rwaInvestments.map((entry, index) => (
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
                                <div>Type: {data.type}</div>
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

                <div className="mt-4 space-y-2">
                  <div className="text-sm font-medium">Allocation by Region</div>
                  <div className="space-y-2">
                    {Array.from(new Set(rwaInvestments.map((i) => i.region))).map((region, index) => {
                      const totalAllocation = rwaInvestments
                        .filter((i) => i.region === region)
                        .reduce((sum, i) => sum + i.allocation, 0)

                      return (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{region}</span>
                            <span>{totalAllocation}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-1.5">
                            <div
                              className="h-1.5 rounded-full"
                              style={{
                                width: `${totalAllocation}%`,
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Investment Details */}
          <Card className="backdrop-blur-sm bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">RWA Investment Details</CardTitle>
              <CardDescription>Detailed breakdown of each real-world asset in your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rwaInvestments.map((investment) => (
                  <div
                    key={investment.id}
                    className="p-4 rounded-lg border border-border/50 bg-background/30 hover:bg-background/50 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="md:w-1/4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${investment.color}20` }}
                          >
                            <investment.icon className="h-5 w-5" style={{ color: investment.color }} />
                          </div>
                          <div>
                            <h3 className="font-medium">{investment.name}</h3>
                            <p className="text-xs text-muted-foreground">
                              {investment.type} • {investment.country}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="md:w-1/4 grid grid-cols-2 gap-x-4 gap-y-2">
                        <div className="text-sm text-muted-foreground">Current APY:</div>
                        <div className="text-sm font-medium flex items-center">
                          {investment.apy}%
                          <span
                            className={`ml-1 text-xs ${investment.trend === "up" ? "text-green-500" : "text-red-500"}`}
                          >
                            {investment.change}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground">Impact:</div>
                        <div className="text-sm font-medium">{investment.impact}</div>
                      </div>

                      <div className="md:w-1/4">
                        <div className="text-sm text-muted-foreground mb-1">Allocation: {investment.allocation}%</div>
                        <Progress value={investment.allocation} className="h-2" indicatorClassName="bg-[#4ECDC4]" />
                      </div>

                      <div className="md:w-1/4">
                        <div className="text-sm text-muted-foreground mb-1">Impact Metric</div>
                        <div className="text-sm font-medium">{investment.impactMetric}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Marketplace Tab */}
        <TabsContent value="marketplace" className="space-y-6 pt-4">
          <Card className="backdrop-blur-sm bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">RWA Marketplace</CardTitle>
              <CardDescription>Discover and invest in tokenized real-world assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {rwaListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="rounded-lg border border-border/50 bg-background/30 hover:bg-background/40 transition-all overflow-hidden"
                  >
                    <div className="relative h-40 bg-muted">
                      <img
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-[#4ECDC4]/80 text-white border-[#4ECDC4]/20">{listing.apy}% APY</Badge>
                      </div>
                    </div>

                    <div className="p-4">
                      <h3 className="font-medium text-lg mb-1">{listing.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="outline" className="bg-background/50">
                          {listing.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{listing.location}</span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{listing.description}</p>

                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Funding Progress</span>
                          <span className="font-medium">{listing.funded}%</span>
                        </div>
                        <Progress value={listing.funded} className="h-2" indicatorClassName="bg-[#4ECDC4]" />

                        <div className="flex justify-between text-xs">
                          <span>Min. Investment: ${listing.minInvestment}</span>
                          <span>Total Value: ${(listing.totalValue / 1000000).toFixed(1)}M</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex -space-x-2">
                            {[...Array(3)].map((_, i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs"
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            +{Math.floor(Math.random() * 100) + 50} investors
                          </span>
                        </div>

                        <Button
                          size="sm"
                          className="bg-[#4ECDC4] hover:bg-[#3dbcb3] text-white"
                          onClick={() => handleListingSelect(listing.id)}
                        >
                          <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                          Buy Tokens
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-sm bg-background/50 border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Why Invest in RWAs?</CardTitle>
              <CardDescription>Benefits of tokenized real-world assets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="p-4 rounded-lg bg-background/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center mb-3">
                    <PiggyBank className="h-5 w-5 text-[#4ECDC4]" />
                  </div>
                  <h3 className="font-medium mb-2">Stable Returns</h3>
                  <p className="text-sm text-muted-foreground">
                    RWAs provide consistent yields backed by tangible assets, offering stability during market
                    volatility.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center mb-3">
                    <Users className="h-5 w-5 text-[#4ECDC4]" />
                  </div>
                  <h3 className="font-medium mb-2">Fractional Ownership</h3>
                  <p className="text-sm text-muted-foreground">
                    Access previously inaccessible assets through fractional ownership with low minimum investments.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-background/30 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-[#4ECDC4]/20 flex items-center justify-center mb-3">
                    <Globe className="h-5 w-5 text-[#4ECDC4]" />
                  </div>
                  <h3 className="font-medium mb-2">Impact Investing</h3>
                  <p className="text-sm text-muted-foreground">
                    Support sustainable development and infrastructure projects with positive environmental and social
                    impact.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Purchase Modal */}
      {selectedListing && (
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="sm:max-w-md backdrop-blur-xl bg-background/80 border border-border/50">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Purchase RWA Tokens</DialogTitle>
              <DialogDescription>{rwaListings.find((l) => l.id === selectedListing)?.name}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <Badge className="bg-[#4ECDC4]/20 text-[#4ECDC4] border-[#4ECDC4]/20">
                  {rwaListings.find((l) => l.id === selectedListing)?.apy}% APY
                </Badge>
                <Badge variant="outline">Token: {rwaListings.find((l) => l.id === selectedListing)?.tokenSymbol}</Badge>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Investment Amount (USDC)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    setPurchaseAmount(value)
                    updateTokensFromAmount(value)
                  }}
                  className="bg-background/50"
                />
                <div className="text-xs text-muted-foreground">
                  Min: ${rwaListings.find((l) => l.id === selectedListing)?.minInvestment} | Price per token: $
                  {rwaListings.find((l) => l.id === selectedListing)?.pricePerToken}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="tokens">Number of Tokens</Label>
                <Input
                  id="tokens"
                  type="number"
                  value={purchaseTokens}
                  onChange={(e) => {
                    const value = Number.parseInt(e.target.value) || 0
                    setPurchaseTokens(value)
                    updateAmountFromTokens(value)
                  }}
                  className="bg-background/50"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#4ECDC4]/10 border border-[#4ECDC4]/20">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#4ECDC4] mt-0.5" />
                  <div>
                    <p className="text-sm font-medium mb-1">Investment Details</p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div className="text-muted-foreground">Risk Level:</div>
                      <div>{rwaListings.find((l) => l.id === selectedListing)?.risk}</div>
                      <div className="text-muted-foreground">Investment Term:</div>
                      <div>{rwaListings.find((l) => l.id === selectedListing)?.term}</div>
                      <div className="text-muted-foreground">Liquidity:</div>
                      <div>{rwaListings.find((l) => l.id === selectedListing)?.liquidity}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-medium mb-1">Important Notice</p>
                    <p className="text-muted-foreground">
                      Investing in RWAs involves risks. Please review all documentation before investing.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" onClick={() => setShowPurchaseModal(false)}>
                Cancel
              </Button>
              <Button className="bg-[#4ECDC4] hover:bg-[#3dbcb3] text-white" onClick={handlePurchase}>
                <ShoppingBag className="mr-2 h-4 w-4" />
                Purchase Tokens
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* AI Insights */}
      <Card className="backdrop-blur-sm bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-[#4ECDC4]" />
            AI-Powered Insights
          </CardTitle>
          <CardDescription>Smart recommendations for your RWA portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#4ECDC4]/30 bg-[#4ECDC4]/10">
              <h3 className="font-medium mb-2">Diversification Opportunity</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Your portfolio is heavily concentrated in African investments. Consider adding exposure to Asian or
                South American RWA projects to improve geographical diversification and reduce regional risk.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#4ECDC4] hover:bg-[#3dbcb3] text-[#3C3D42]">
                  View Opportunities
                </Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-[#4ECDC4]/30 bg-[#4ECDC4]/10">
              <h3 className="font-medium mb-2">Impact Enhancement</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Increasing your allocation to Solar Microgrids Uganda by 5% would significantly boost your environmental
                impact score while maintaining similar risk-adjusted returns.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#4ECDC4] hover:bg-[#3dbcb3] text-[#3C3D42]">
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

