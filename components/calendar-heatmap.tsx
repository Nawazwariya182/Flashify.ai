"use client"

import { useEffect, useState } from "react"
import { format, subDays, eachDayOfInterval } from "date-fns"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { getCalendarData } from "@/app/services/storage-service"

interface CalendarHeatmapProps {
  timeRange: "week" | "month" | "year"
}

export function CalendarHeatmap({ timeRange }: CalendarHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<Record<string, number>>({})

  useEffect(() => {
    // Load calendar data
    const calendarData = getCalendarData()
    setHeatmapData(calendarData)
  }, [timeRange])

  // Determine date range based on timeRange
  const getDaysToShow = () => {
    switch (timeRange) {
      case "week":
        return 7
      case "month":
        return 30
      case "year":
        return 90 // Show 3 months for year view
      default:
        return 30
    }
  }

  // Group data by week and month
  const weeks: { date: Date; days: { date: Date; value: number }[] }[] = []
  const today = new Date()
  const startDate = subDays(today, getDaysToShow())

  let currentWeek: { date: Date; days: { date: Date; value: number }[] } = {
    date: startDate,
    days: [],
  }

  eachDayOfInterval({
    start: startDate,
    end: today,
  }).forEach((date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    const value = heatmapData[dateStr] || 0

    if (date.getDay() === 0 && currentWeek.days.length > 0) {
      weeks.push(currentWeek)
      currentWeek = { date, days: [] }
    }

    currentWeek.days.push({ date, value })
  })

  if (currentWeek.days.length > 0) {
    weeks.push(currentWeek)
  }

  // Get color based on value
  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-100 dark:bg-gray-800"
    if (value <= 5) return "bg-primary/25"
    if (value <= 15) return "bg-primary/50"
    if (value <= 30) return "bg-primary/75"
    return "bg-primary"
  }

  // Get label based on value
  const getLabel = (value: number) => {
    if (value === 0) return "No activity"
    if (value <= 5) return "1-5 cards"
    if (value <= 15) return "6-15 cards"
    if (value <= 30) return "16-30 cards"
    return "30+ cards"
  }

  return (
    <div className="w-full">
      <div className="flex mb-1 text-xs text-muted-foreground">
        <div className="flex-1 text-center">Mon</div>
        <div className="flex-1 text-center">Wed</div>
        <div className="flex-1 text-center">Fri</div>
      </div>
      <div className="flex flex-col gap-1">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex gap-1">
            {week.days.map((day, dayIndex) => (
              <TooltipProvider key={dayIndex}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={`w-full aspect-square rounded-sm ${getColor(day.value)}`} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="text-xs">
                      <p className="font-medium">{format(day.date, "MMM d, yyyy")}</p>
                      <p>{getLabel(day.value)}</p>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-2 gap-1">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
          <span>Less</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <div className="w-3 h-3 rounded-sm bg-primary" />
          <span>More</span>
        </div>
      </div>
    </div>
  )
}
