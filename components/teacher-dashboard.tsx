"use client"

import { Calendar, User, LogOut, GraduationCap, ChevronDown } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabase"

interface TeacherDashboardProps {
  teacherName: string
  onLogout: () => void
}

interface Row {
  id: string
  class_name: string
  day: string
  subject: string
  slot: string | null
  teacher: string | null
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const timeSlots = [
  "4:00-5:00",
  "5:00-6:00",
  "5:30-6:30", 
  "6:00-7:00",
  "7:00-8:00",
  "7:00-8:30",
  "8:00-9:00"
]

export function TeacherDashboard({ teacherName, onLogout }: TeacherDashboardProps) {
  const [selectedClass, setSelectedClass] = useState("Class 6")
  const [data, setData] = useState<Row[]>([])

  // 🔥 FETCH FROM SUPABASE
  const fetchData = async () => {
    const { data } = await supabase
      .from("timetable")
      .select("*")
      .eq("class_name", selectedClass)

    setData(data || [])
  }

  useEffect(() => {
    fetchData()
  }, [selectedClass])

  const isMyClass = (teacher: string | null) => {
    return teacher?.toLowerCase() === teacherName.toLowerCase()
  }

  const getCellData = (day: string, slot: string) => {
    return data.find(
      (item) =>
        item.day === day &&
        item.slot === slot
    )
  }

  return (
    <div className="min-h-screen bg-gradient-purple relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-40 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="glass border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              <div className="flex items-center gap-3">
               <img
  src="/logoo.png"
  alt="NAS Coaching"
  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover"
/>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold gradient-text">NAS Timetable</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">View all class schedules</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

          {/* Welcome */}
          <div className="glass-card rounded-2xl p-6 mb-6 flex justify-center items-center">
            <div className="flex justify-center items-center">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground text-center"></h2>
              <div>
               <h2 className="text-xl sm:text-2xl font-bold text-foreground">
  NAS Timetable
</h2>
              </div>
            </div>
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">View Timetable</h3>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="ml-auto bg-secondary/50 border border-border rounded-xl px-4 py-2 text-sm"
            >
              <option>Class 6</option>
              <option>Class 7</option>
              <option>Class 8</option>
              <option>Class 9</option>
              <option>Class 10</option>
              <option>Class 11 Science</option>
              <option>Class 11 Commerce</option>
            </select>
          </div>

          {/* Timetable */}
          <div className="glass-card rounded-2xl p-6 overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm text-muted-foreground">Time</th>
                  {days.map((day) => (
                    <th key={day} className="p-3 text-center">{day}</th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeSlots.map((slot) => (
                  <tr key={slot}>
                    <td className="p-3 text-primary font-medium">{slot}</td>

                    {days.map((day) => {
                      const cell = getCellData(day, slot)
                      const highlight = isMyClass(cell?.teacher || "")

                      return (
                        <td key={day} className="p-2">
                          <div
                            className={cn(
                              "p-3 rounded-xl text-center",
                              highlight
                                ? "bg-purple-500/30 border-2 border-purple-400"
                                : "bg-secondary/30"
                            )}
                          >
                            <p className="text-sm font-semibold">{cell?.subject || "-"}</p>
                            <p className="text-xs">{cell?.teacher || ""}</p>
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  )
}