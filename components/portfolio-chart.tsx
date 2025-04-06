"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  { name: "Jan", value: 10000 },
  { name: "Feb", value: 10200 },
  { name: "Mar", value: 10150 },
  { name: "Apr", value: 10400 },
  { name: "May", value: 10800 },
  { name: "Jun", value: 11200 },
  { name: "Jul", value: 11500 },
  { name: "Aug", value: 11800 },
  { name: "Sep", value: 12100 },
  { name: "Oct", value: 12300 },
  { name: "Nov", value: 12400 },
  { name: "Dec", value: 12546 },
]

export function PortfolioChart() {
  return (
    <ChartContainer className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="var(--muted-foreground)"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length > 0 && payload[0]?.payload) {
                const value = payload[0]?.value
                return (
                  <ChartTooltip>
                    <ChartTooltipContent className="bg-background/80 backdrop-blur-sm">
                      <div className="flex flex-col gap-2">
                        <p className="text-sm font-medium">{payload[0]?.payload?.name || ""}</p>
                        <p className="text-lg font-bold">${value ? value.toLocaleString() : "0"}</p>
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
            stroke="#9CCD62"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: "#9CCD62", stroke: "var(--background)", strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

