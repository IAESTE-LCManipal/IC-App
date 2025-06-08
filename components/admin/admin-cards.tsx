import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export async function SectionCards() {
  let stats = {
    totalInterns: "—",
    completedSRO: "—",
    zeroCompleted: "—",
    lcsInSlot: "—",
    slotNumber: null,
    error: "",
  }
  try {
    const res = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + "/api/admins/section-stats",
      { method: "POST", cache: "no-store" }
    )
    const data = await res.json()
    if (data.success) {
      stats = { ...stats, ...data.stats }
    } else {
      stats.error = data.error || "Failed to fetch stats"
    }
  } catch (e) {
    stats.error = "Error fetching stats"
  }

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
    <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 2xl:grid-cols-4 lg:px-6">
      <Card className="@container/card min-h-[140px]">
        <CardHeader className="relative">
          <CardDescription>Total Interns in Current Slot</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.totalInterns}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Intern(s) assigned to slot {stats.slotNumber ?? "N/A"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card min-h-[140px]">
        <CardHeader className="relative">
          <CardDescription>Interns with Completed SRO Checklist</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.completedSRO}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            All checklist items completed in slot {stats.slotNumber ?? "N/A"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card min-h-[140px]">
        <CardHeader className="relative">
          <CardDescription>Interns with No Checklist Items Completed</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.zeroCompleted}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Interns with No Checklist progress yet in slot {stats.slotNumber ?? "N/A"}
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card min-h-[140px]">
        <CardHeader className="relative">
          <CardDescription>LCs in Current Slot</CardDescription>
          <CardTitle className="@[250px]/card:text-3xl text-2xl font-semibold tabular-nums">
            {stats.lcsInSlot}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Number of LCs assigned to slot {stats.slotNumber ?? "N/A"}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
