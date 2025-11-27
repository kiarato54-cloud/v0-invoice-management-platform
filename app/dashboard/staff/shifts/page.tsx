"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

interface Shift {
  id: string
  employeeName: string
  date: string
  shiftType: string
  startTime: string
  endTime: string
  clockInTime?: string
  clockOutTime?: string
  status: "scheduled" | "ongoing" | "completed" | "cancelled"
}

const mockShifts: Shift[] = [
  {
    id: "1",
    employeeName: "John Doe",
    date: "2024-11-27",
    shiftType: "Morning",
    startTime: "08:00",
    endTime: "16:00",
    clockInTime: "07:58",
    clockOutTime: "16:02",
    status: "completed",
  },
  {
    id: "2",
    employeeName: "Jane Smith",
    date: "2024-11-27",
    shiftType: "Afternoon",
    startTime: "16:00",
    endTime: "23:59",
    clockInTime: "15:55",
    status: "ongoing",
  },
  {
    id: "3",
    employeeName: "Peter Johnson",
    date: "2024-11-28",
    shiftType: "Morning",
    startTime: "08:00",
    endTime: "16:00",
    status: "scheduled",
  },
]

const statusColors = {
  scheduled: "bg-blue-500/20 text-blue-700 border-blue-500/50",
  ongoing: "bg-yellow-500/20 text-yellow-700 border-yellow-500/50",
  completed: "bg-green-500/20 text-green-700 border-green-500/50",
  cancelled: "bg-red-500/20 text-red-700 border-red-500/50",
}

export default function ShiftsPage() {
  const { user } = useAuth()
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0])

  if (!user) return null

  const filteredShifts = mockShifts.filter((s) => s.date === filterDate)

  const stats = {
    scheduled: mockShifts.filter((s) => s.status === "scheduled").length,
    ongoing: mockShifts.filter((s) => s.status === "ongoing").length,
    completed: mockShifts.filter((s) => s.status === "completed").length,
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Staff Shifts</h1>
            <p className="text-muted-foreground mt-1">Schedule and manage employee shifts</p>
          </div>
          <Button>
            <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Shift
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.scheduled}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ongoing Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">{stats.ongoing}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{stats.completed}</div>
            </CardContent>
          </Card>
        </div>

        {/* Date Filter */}
        <div className="flex gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Filter by Date</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-4 py-2 rounded-md bg-input border border-border"
            />
          </div>
        </div>

        {/* Shifts Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/50 border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Employee</th>
                    <th className="px-4 py-3 text-left font-medium">Shift Type</th>
                    <th className="px-4 py-3 text-left font-medium">Scheduled</th>
                    <th className="px-4 py-3 text-left font-medium">Actual</th>
                    <th className="px-4 py-3 text-center font-medium">Status</th>
                    <th className="px-4 py-3 text-center font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredShifts.map((shift) => (
                    <tr key={shift.id} className="border-b border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{shift.employeeName}</td>
                      <td className="px-4 py-3">{shift.shiftType}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {shift.startTime} - {shift.endTime}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {shift.clockInTime ? `${shift.clockInTime} - ${shift.clockOutTime || "..."}` : "Not clocked in"}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-md text-xs font-medium border ${statusColors[shift.status]}`}
                        >
                          {shift.status.charAt(0).toUpperCase() + shift.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {shift.status === "scheduled" && (
                          <Button size="sm" variant="outline">
                            Edit
                          </Button>
                        )}
                        {shift.status === "ongoing" && (
                          <Button size="sm" variant="outline" className="text-destructive bg-transparent">
                            Clock Out
                          </Button>
                        )}
                        {shift.status === "completed" && (
                          <Button size="sm" variant="ghost">
                            View
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
