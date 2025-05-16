"use client"

import { useEffect, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { getStudyDataForChart } from "@/app/services/storage-service"

interface StatsChartProps {
  timeRange: "week" | "month" | "year"
}

export function StatsChart({ timeRange }: StatsChartProps) {
  const [data, setData] = useState<{ day: string; cards: number }[]>([])

  useEffect(() => {
    // Load chart data based on time range
    const chartData = getStudyDataForChart()
    setData(chartData)
  }, [timeRange])

  return (
    <ChartContainer className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorCards" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8} />
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltip>
                    <ChartTooltipContent>
                      <div className="flex flex-col gap-1">
                        <p className="text-sm font-medium">{payload[0].payload.day}</p>
                        <p className="text-sm">
                          <span className="font-medium">{payload[0].value}</span> cards reviewed
                        </p>
                      </div>
                    </ChartTooltipContent>
                  </ChartTooltip>
                )
              }
              return null
            }}
          />
          <Bar dataKey="cards" fill="url(#colorCards)" radius={[4, 4, 0, 0]} barSize={30} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
