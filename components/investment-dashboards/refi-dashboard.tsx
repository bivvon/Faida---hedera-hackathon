"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts"
import { Leaf, Zap, TreePine, Cloud, Droplets } from "lucide-react"

// ReFi projects data
const refiProjects = [
  {
    id: 1,
    name: "Kakamega Forest Carbon Credits",
    type: "Carbon Offset",
    location: "Kenya",
    apy: 5.8,
    risk: "Medium",
    allocation: 35,
    color: "#9CCD62",
    impact: "Very High",
    impactMetric: "125,000 tons CO₂ offset",
    description: "Forest conservation and carbon sequestration",
    progress: 78,
    icon: TreePine,
    co2Offset: 43750,
    treesPlanted: 85000,
  },
  {
    id: 2,
    name: "Celo Green Bonds",
    type: "Green Finance",
    location: "Global",
    apy: 4.2,
    risk: "Low",
    allocation: 25,
    color: "#4ECDC4",
    impact: "High",
    impactMetric: "$2.4M to green projects",
    description: "Blockchain-based green bond issuance",
    progress: 92,
    icon: Leaf,
    co2Offset: 18500,
    treesPlanted: 0,
  },
  {
    id: 3,
    name: "Community Land Tokenization",
    type: "Land Restoration",
    location: "Tanzania",
    apy: 6.5,
    risk: "Medium-High",
    allocation: 20,
    color: "#FFB547",
    impact: "High",
    impactMetric: "12,000 hectares restored",
    description: "Community-owned land restoration",
    progress: 65,
    icon: Droplets,
    co2Offset: 28000,
    treesPlanted: 45000,
  },
  {
    id: 4,
    name: "Clean Water Credits",
    type: "Water",
    location: "Uganda",
    apy: 5.2,
    risk: "Medium",
    allocation: 15,
    color: "#845EC2",
    impact: "Very High",
    impactMetric: "35,000 people with clean water",
    description: "Water purification infrastructure",
    progress: 45,
    icon: Cloud,
    co2Offset: 8500,
    treesPlanted: 0,
  },
  {
    id: 5,
    name: "Regenerative Agriculture Fund",
    type: "Agriculture",
    location: "Ethiopia",
    apy: 7.1,
    risk: "High",
    allocation: 5,
    color: "#FF6B6B",
    impact: "Medium-High",
    impactMetric: "850 farmers supported",
    description: "Sustainable farming practices",
    progress: 30,
    icon: Leaf,
    co2Offset: 12000,
    treesPlanted: 25000,
  },
]

// Impact metrics data
const impactMetrics = [
  { name: "Carbon Reduction", value: 110750, unit: "tons CO₂" },
  { name: "Trees Planted", value: 155000, unit: "trees" },
  { name: "Land Restored", value: 15200, unit: "hectares" },
  { name: "Communities Supported", value: 47, unit: "communities" },
  { name: "People Impacted", value: 125000, unit: "people" },
]

// Community funding data
const communityFundingData = [
  { month: "Jan", amount: 120000 },
  { month: "Feb", amount: 150000 },
  { month: "Mar", amount: 180000 },
  { month: "Apr", amount: 220000 },
  { month: "May", amount: 280000 },
  { month: "Jun", amount: 350000 },
  { month: "Jul", amount: 420000 },
  { month: "Aug", amount: 500000 },
  { month: "Sep", amount: 580000 },
  { month: "Oct", amount: 650000 },
  { month: "Nov", amount: 720000 },
  { month: "Dec", amount: 800000 },
]

// Impact radar data
const impactRadarData = [
  { subject: "Carbon", A: 85, fullMark: 100 },
  { subject: "Biodiversity", A: 78, fullMark: 100 },
  { subject: "Community", A: 92, fullMark: 100 },
  { subject: "Water", A: 65, fullMark: 100 },
  { subject: "Soil", A: 72, fullMark: 100 },
]

const COLORS = ["#9CCD62", "#4ECDC4", "#FFB547", "#845EC2", "#FF6B6B"]

export function RefiDashboard() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null)

  const totalApy = refiProjects.reduce((sum, project) => sum + (project.apy * project.allocation) / 100, 0).toFixed(2)
  const totalCO2Offset = refiProjects.reduce((sum, project) => sum + project.co2Offset, 0)
  const totalTreesPlanted = refiProjects.reduce((sum, project) => sum + project.treesPlanted, 0)

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="h-5 w-5 text-[#9CCD62]" />
            The Impact Hub
          </h2>
          <p className="text-muted-foreground">
            Your regenerative finance investments with environmental impact tracking
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#9CCD62]/20 text-[#9CCD62] border-[#9CCD62]/20 px-3 py-1.5">
            <Zap className="mr-1 h-3.5 w-3.5" />
            {totalApy}% Weighted APY
          </Badge>
          <Button variant="outline" size="sm" className="gap-2">
            <TreePine className="h-4 w-4" />
            Impact Report
          </Button>
        </div>
      </div>

      {/* Impact Metrics */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-8 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Environmental Impact</CardTitle>
            <CardDescription>Real-time tracking of your ReFi portfolio's positive impact</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              {impactMetrics.map((metric, index) => (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-border/50 bg-background/30 text-center"
                  style={{ borderColor: `${COLORS[index % COLORS.length]}50` }}
                >
                  <div className="text-lg md:text-xl font-bold" style={{ color: COLORS[index % COLORS.length] }}>
                    {metric.value.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">{metric.unit}</div>
                  <div className="text-sm font-medium">{metric.name}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm font-medium mb-2">Carbon Offset Progress</div>
                <div className="relative h-40 w-full bg-background/30 rounded-lg border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#9CCD62]">{totalCO2Offset.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">tons CO₂ offset</div>
                    </div>
                  </div>

                  {/* Animated forest visualization */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 overflow-hidden">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-0 w-6 h-12 animate-float"
                        style={{
                          left: `${i * 5}%`,
                          animationDelay: `${i * 0.2}s`,
                          opacity: 0.7 + Math.random() * 0.3,
                        }}
                      >
                        <TreePine className="w-full h-full text-[#9CCD62]" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">Trees Planted</div>
                <div className="relative h-40 w-full bg-background/30 rounded-lg border border-border/50 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-[#9CCD62]">{totalTreesPlanted.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">trees planted</div>
                    </div>
                  </div>

                  {/* Tree growth visualization */}
                  <div className="absolute bottom-0 left-0 right-0 h-20">
                    <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#9CCD62]/20"></div>
                    {Array.from({ length: 10 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute bottom-2"
                        style={{
                          left: `${i * 10 + 5}%`,
                          height: `${8 + Math.random() * 10}px`,
                          width: "2px",
                          backgroundColor: "#9CCD62",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-4 backdrop-blur-sm bg-background/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">Impact Radar</CardTitle>
            <CardDescription>Multi-dimensional impact assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={impactRadarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                  />
                  <Radar name="Impact" dataKey="A" stroke="#9CCD62" fill="#9CCD62" fillOpacity={0.5} />
                  <RechartsTooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length > 0) {
                        return (
                          <div className="bg-background/90 backdrop-blur-sm p-2 rounded-md border border-border/50 text-sm">
                            <div className="font-medium">{payload[0].payload.subject}</div>
                            <div>Score: {payload[0].value}/100</div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 p-3 bg-[#9CCD62]/10 rounded-md border border-[#9CCD62]/30">
              <h3 className="text-sm font-medium mb-2">Overall Impact Score</h3>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-[#9CCD62]">
                  {Math.round(impactRadarData.reduce((sum, item) => sum + item.A, 0) / impactRadarData.length)}
                </div>
                <Badge className="bg-green-500/20 text-green-500 border-green-500/20">Excellent</Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Your ReFi portfolio has exceptional performance in Community and Carbon impact categories.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Project Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {refiProjects.map((project) => (
          <Card
            key={project.id}
            className="backdrop-blur-sm bg-background/50 border-border/50 hover:border-[#9CCD62]/50 transition-colors cursor-pointer"
            onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${project.color}20` }}
                >
                  <project.icon className="h-5 w-5" style={{ color: project.color }} />
                </div>
                <Badge className="bg-background/50">{project.type}</Badge>
              </div>
              <CardTitle className="text-lg mt-2">{project.name}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div className="text-muted-foreground">Location:</div>
                  <div className="font-medium">{project.location}</div>
                  <div className="text-muted-foreground">APY:</div>
                  <div className="font-medium">{project.apy}%</div>
                  <div className="text-muted-foreground">Impact:</div>
                  <div className="font-medium">{project.impact}</div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Project Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" indicatorClassName="bg-[#9CCD62]" />
                </div>

                <div className="p-3 rounded-md" style={{ backgroundColor: `${project.color}10` }}>
                  <div className="text-xs text-muted-foreground">Impact Metric</div>
                  <div className="text-sm font-medium">{project.impactMetric}</div>
                </div>

                {selectedProject === project.id && (
                  <div className="pt-2 space-y-3">
                    <div className="text-sm font-medium">Detailed Impact</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2 rounded-md bg-background/50 text-center">
                        <div className="font-medium mb-1">CO₂ Offset</div>
                        <div className="text-[#9CCD62]">{project.co2Offset.toLocaleString()} tons</div>
                      </div>
                      <div className="p-2 rounded-md bg-background/50 text-center">
                        <div className="font-medium mb-1">Trees Planted</div>
                        <div className="text-[#9CCD62]">{project.treesPlanted.toLocaleString()}</div>
                      </div>
                    </div>
                    <Button size="sm" className="w-full bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                      View Full Report
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Community Funding */}
      <Card className="backdrop-blur-sm bg-background/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Community Funding Bar</CardTitle>
          <CardDescription>Total contributions from Faida users to ReFi causes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communityFundingData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
                  tickFormatter={(value) => `$${value / 1000}k`}
                />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length > 0) {
                      return (
                        <ChartTooltip>
                          <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">{label}</p>
                              <p className="text-lg font-bold text-[#9CCD62]">${payload[0].value.toLocaleString()}</p>
                              <p className="text-xs text-muted-foreground">Total community funding</p>
                            </div>
                          </ChartTooltipContent>
                        </ChartTooltip>
                      )
                    }
                    return null
                  }}
                />
                <Bar dataKey="amount" fill="#9CCD62" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border/50 bg-background/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Total Funding</div>
              <div className="text-2xl font-bold text-[#9CCD62]">$800,000</div>
              <div className="text-xs text-muted-foreground">From 3,500+ contributors</div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-background/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Projects Funded</div>
              <div className="text-2xl font-bold text-[#9CCD62]">24</div>
              <div className="text-xs text-muted-foreground">Across 12 countries</div>
            </div>

            <div className="p-4 rounded-lg border border-border/50 bg-background/30 text-center">
              <div className="text-sm text-muted-foreground mb-1">Your Contribution</div>
              <div className="text-2xl font-bold text-[#9CCD62]">$2,450</div>
              <div className="text-xs text-muted-foreground">Top 10% of contributors</div>
            </div>
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
          <CardDescription>Smart recommendations for your ReFi portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-[#9CCD62]/30 bg-[#9CCD62]/10">
              <h3 className="font-medium mb-2">Impact Optimization</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Increasing your allocation to Kakamega Forest Carbon Credits by 10% would boost your carbon offset by an
                estimated 12,500 tons annually while maintaining similar risk-adjusted returns.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                  Optimize Portfolio
                </Button>
                <Button size="sm" variant="outline">
                  View Analysis
                </Button>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-[#9CCD62]/30 bg-[#9CCD62]/10">
              <h3 className="font-medium mb-2">New ReFi Opportunity</h3>
              <p className="text-sm text-muted-foreground mb-3">
                A new blue carbon project in Mozambique is seeking funding with projected returns of 6.8% APY and
                significant marine ecosystem restoration impact. This would complement your existing portfolio.
              </p>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#9CCD62] hover:bg-[#8bbc51] text-[#3C3D42]">
                  View Opportunity
                </Button>
                <Button size="sm" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

