"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Landmark,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Clock,
  Eye,
  AlertTriangle,
  BarChart2,
  Activity,
} from "lucide-react"

// Market data for tokenized securities
const marketData = [
  {
    id: 1,
    name: "Kenya T-Bond 2025",
    ticker: "KE25",
    type: "Government Bond",
    price: 102.45,
    change: 0.32,
    changePercent: 0.31,
    yield: 11.2,
    maturity: "2025-06-15",
    volume: 1245000,
    marketCap: 125000000,
    sector: "Fixed Income",
    issuer: "Government of Kenya",
    rating: "B+",
    liquidity: "High",
    lastUpdate: "2024-03-20T10:30:00Z"
  },
  {
    id: 2,
    name: "Safaricom Equity",
    ticker: "SCOM",
    type: "Equity",
    price: 28.75,
    change: -0.45,
    changePercent: -1.54,
    dividend: 4.2,
    volume: 3450000,
    marketCap: 1150000000,
    sector: "Telecommunications",
    issuer: "Safaricom PLC",
    rating: "A",
    liquidity: "Very High",
    lastUpdate: "2024-03-20T10:30:00Z"
  },
  {
    id: 3,
    name: "Nigeria Green Bond",
    ticker: "NGB26",
    type: "ESG Bond",
    price: 99.85,
    change: 0.15,
    changePercent: 0.15,
    yield: 9.8,
    maturity: "2026-12-20",
    volume: 875000,
    marketCap: 87500000,
    sector: "ESG",
    issuer: "Federal Republic of Nigeria",
    rating: "B",
    liquidity: "Medium",
    lastUpdate: "2024-03-20T10:30:00Z"
  },
  {
    id: 4,
    name: "MTN Group",
    ticker: "MTN",
    type: "Equity",
    price: 152.3,
    change: 2.8,
    changePercent: 1.87,
    dividend: 5.1,
    volume: 2150000,
    marketCap: 2850000000,
    sector: "Telecommunications",
    issuer: "MTN Group Limited",
    rating: "A-",
    liquidity: "High",
    lastUpdate: "2024-03-20T10:30:00Z"
  },
]

// Historical price data
const historicalPriceData = [
  { date: "Jan", KE25: 100.2, SCOM: 30.5, NGB26: 98.5, MTN: 145.2 },
  { date: "Feb", KE25: 100.5, SCOM: 31.2, NGB26: 98.8, MTN: 146.5 },
  { date: "Mar", KE25: 101.1, SCOM: 30.8, NGB26: 99.1, MTN: 148.2 },
  { date: "Apr", KE25: 101.4, SCOM: 29.5, NGB26: 99.3, MTN: 147.8 },
  { date: "May", KE25: 101.8, SCOM: 28.9, NGB26: 99.5, MTN: 149.2 },
  { date: "Jun", KE25: 102.1, SCOM: 29.2, NGB26: 99.6, MTN: 150.5 },
  { date: "Jul", KE25: 102.3, SCOM: 29.5, NGB26: 99.7, MTN: 151.2 },
  { date: "Aug", KE25: 102.45, SCOM: 28.75, NGB26: 99.85, MTN: 152.3 },
]

// Sector performance data
const sectorPerformance = [
  { sector: "Fixed Income", change: 0.8, volume: "2.4B", securities: 12 },
  { sector: "Equities", change: -0.5, volume: "1.8B", securities: 8 },
  { sector: "ESG", change: 1.2, volume: "850M", securities: 4 },
  { sector: "Corporate Bonds", change: 0.3, volume: "1.2B", securities: 6 },
]

// Market depth data
const marketDepth = [
  { price: 102.40, buyVolume: 50000, sellVolume: 45000 },
  { price: 102.35, buyVolume: 75000, sellVolume: 60000 },
  { price: 102.30, buyVolume: 100000, sellVolume: 80000 },
  { price: 102.25, buyVolume: 125000, sellVolume: 100000 },
  { price: 102.20, buyVolume: 150000, sellVolume: 120000 },
]

export function CapitalMarketsDashboard() {
  const [selectedAsset, setSelectedAsset] = useState(marketData[0])
  const [timeframe, setTimeframe] = useState("1M")
  const [view, setView] = useState("overview")

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Market Value</CardTitle>
            <Landmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4.2B</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-[#9CCD62]" />
              +2.4% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">24h Volume</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$156.8M</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 mr-1 text-[#9CCD62]" />
              +12.3% from yesterday
            </div>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Securities</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Across 4 asset classes</p>
          </CardContent>
        </Card>
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Market Status</CardTitle>
            <TrendingUp className="h-4 w-4 text-[#9CCD62]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Open</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Next close in 4h 23m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 md:grid-cols-7">
        {/* Price Chart */}
        <Card className="md:col-span-4 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Price Performance</CardTitle>
              <CardDescription>Historical price data for {selectedAsset.name}</CardDescription>
            </div>
            <div className="flex gap-2">
              {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </Button>
              ))}
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalPriceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line
                    type="monotone"
                    dataKey={selectedAsset.ticker}
                    stroke="#9CCD62"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Market List */}
        <Card className="md:col-span-3 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle>Tokenized Securities</CardTitle>
            <CardDescription>Available for trading</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {marketData.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedAsset.id === asset.id
                      ? "bg-[#9CCD62]/10 border-[#9CCD62]/20"
                      : "bg-background/30 border-border/20 hover:bg-background/50"
                  }`}
                  onClick={() => setSelectedAsset(asset)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">{asset.name}</h4>
                      <p className="text-sm text-muted-foreground">{asset.ticker}</p>
                    </div>
                    <Badge variant={asset.change >= 0 ? "default" : "destructive"}>
                      {asset.change >= 0 ? "+" : ""}
                      {asset.changePercent}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium block">${asset.price}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-medium block">${(asset.volume / 1000000).toFixed(1)}M</span>
                    </div>
                    {asset.type === "Equity" && (
                      <div>
                        <span className="text-muted-foreground">Dividend</span>
                        <span className="font-medium block">{asset.dividend}%</span>
                      </div>
                    )}
                    {asset.type.includes("Bond") && (
                      <div>
                        <span className="text-muted-foreground">Yield</span>
                        <span className="font-medium block">{asset.yield}%</span>
                      </div>
                    )}
                    <div>
                      <span className="text-muted-foreground">Sector</span>
                      <span className="font-medium block">{asset.sector}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-medium block">{asset.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Depth and Sector Performance */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle>Market Depth</CardTitle>
            <CardDescription>Order book for {selectedAsset.ticker}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {marketDepth.map((level, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-20 text-right text-red-500">{level.price}</div>
                  <div className="flex-1">
                    <Progress value={(level.sellVolume / 150000) * 100} className="h-2 bg-red-100" />
                  </div>
                  <div className="w-20 text-right text-green-500">{level.price}</div>
                  <div className="flex-1">
                    <Progress value={(level.buyVolume / 150000) * 100} className="h-2 bg-green-100" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle>Sector Performance</CardTitle>
            <CardDescription>Overview of market sectors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sectorPerformance.map((sector) => (
                <div key={sector.sector} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{sector.sector}</span>
                    <Badge variant={sector.change >= 0 ? "default" : "destructive"}>
                      {sector.change >= 0 ? "+" : ""}
                      {sector.change}%
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Volume: ${sector.volume}</span>
                    <span>{sector.securities} Securities</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Trading Actions */}
      <Card className="backdrop-blur-sm bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle>Trading Actions</CardTitle>
          <CardDescription>Quick actions for {selectedAsset.ticker}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
              <ArrowUpRight className="mr-2 h-4 w-4" />
              Buy {selectedAsset.ticker}
            </Button>
            <Button variant="destructive">
              <ArrowDownRight className="mr-2 h-4 w-4" />
              Sell {selectedAsset.ticker}
            </Button>
            <Button variant="outline">
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Set Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

