import { useSession } from "next-auth/react"
import React, { useEffect, useState } from "react"
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalInterns: 0,
    completedSRO: 0,
    completedAny: 0,
    zeroCompleted: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchStats = async () => {
      // Fix: cast session.user as any to access sroSlot
      const sroSlot = (session?.user as any)?.sroSlot
      if (!sroSlot) return
      setLoading(true)
      setError("")
      try {
        const res = await fetch("/api/lc/section-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sroSlot }),
        })
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
        } else {
          setError(data.error || "Failed to fetch stats")
        }
      } catch (e: any) {
        setError(e.message || "Error fetching stats")
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [session])

  if (loading) {
    return <div className="p-4">Loading stats...</div>
  }
  if (error) {
    return <div className="p-4 text-red-500">{error}</div>
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 2xl:grid-cols-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Interns in Your Slot</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalInterns}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All interns assigned to your SRO slot
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Interns with Completed SRO Checklist</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.completedSRO}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All checklist items completed
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Interns with Any Checklist Progress</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.completedAny}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            At least one checklist item completed
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Interns with No Checklist Items Completed</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.zeroCompleted}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            No checklist progress yet
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
