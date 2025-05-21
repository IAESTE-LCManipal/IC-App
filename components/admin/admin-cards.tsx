import React, { useEffect, useState } from "react"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [stats, setStats] = useState({
    totalInterns: 0,
    completedSRO: 0,
    zeroCompleted: 0,
    lcsInSlot: 0,
    slotNumber: null,
    loading: true,
    error: "",
  })

  useEffect(() => {
    const fetchStats = async () => {
      setStats((s) => ({ ...s, loading: true, error: "" }))
      try {
        const res = await fetch("/api/admins/section-stats", { method: "POST" })
        const data = await res.json()
        if (data.success) {
          setStats((s) => ({ ...s, ...data.stats, loading: false }))
        } else {
          setStats((s) => ({
            ...s,
            loading: false,
            error: data.error || "Failed to fetch stats",
          }))
        }
      } catch (e) {
        setStats((s) => ({
          ...s,
          loading: false,
          error: (e as any).message || "Error fetching stats",
        }))
      }
    }
    fetchStats()
  }, [])

  if (stats.loading) return <div className="p-4">Loading stats...</div>
  if (stats.error)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <span className="text-red-500 text-lg font-semibold">{stats.error}</span>
      </div>
    )

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 2xl:grid-cols-4 *:data-[slot=card]:shadow-xs *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card lg:px-6">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Interns in Current Slot</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalInterns}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Intern(s) assigned to slot {stats.slotNumber ?? 'N/A'}
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
            All checklist items completed in slot {stats.slotNumber ?? 'N/A'}
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
            Interns with No Checklist progress yet in slot {stats.slotNumber ?? 'N/A'}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>LCs in Current Slot</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.lcsInSlot}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of LCs assigned to slot {stats.slotNumber ?? 'N/A'}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
