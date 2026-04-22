"use client"

import { Calendar, User, LogOut, GraduationCap, ChevronDown } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface TeacherDashboardProps {
  teacherName: string
  onLogout: () => void
}

// Teacher assignments - which classes/subjects each teacher teaches
const teacherAssignments: Record<string, { classNum: number; subject: string }[]> = {
  "Mr. Sharma": [
    { classNum: 6, subject: "Mathematics" },
    { classNum: 7, subject: "Mathematics" },
    { classNum: 8, subject: "Algebra" },
    { classNum: 9, subject: "Advanced Math" },
  ],
  "Mrs. Patel": [
    { classNum: 6, subject: "English" },
    { classNum: 7, subject: "English" },
    { classNum: 8, subject: "English" },
    { classNum: 9, subject: "English Lit" },
  ],
  "Dr. Kumar": [
    { classNum: 6, subject: "Science" },
  ],
  "Mrs. Singh": [
    { classNum: 6, subject: "Hindi" },
    { classNum: 7, subject: "Hindi" },
    { classNum: 8, subject: "Hindi" },
  ],
  "Mr. Verma": [
    { classNum: 6, subject: "Social Studies" },
  ],
  "Mr. Reddy": [
    { classNum: 7, subject: "Physics" },
    { classNum: 8, subject: "Physics" },
    { classNum: 9, subject: "Physics" },
  ],
  "Mrs. Gupta": [
    { classNum: 7, subject: "Chemistry" },
    { classNum: 8, subject: "Chemistry" },
    { classNum: 9, subject: "Chemistry" },
  ],
  "Dr. Das": [
    { classNum: 7, subject: "Biology" },
    { classNum: 8, subject: "Biology" },
    { classNum: 9, subject: "Biology" },
  ],
  "Ms. Jain": [
    { classNum: 8, subject: "Geometry" },
  ],
  "Mr. Tech": [
    { classNum: 9, subject: "Computer Science" },
  ],
}

// Timetable data
const timetableData: Record<number, Record<string, { "6:00-7:00": { subject: string; teacher: string }; "7:00-8:00": { subject: string; teacher: string } }>> = {
  6: {
    Monday: { "6:00-7:00": { subject: "Mathematics", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "English", teacher: "Mrs. Patel" } },
    Tuesday: { "6:00-7:00": { subject: "Science", teacher: "Dr. Kumar" }, "7:00-8:00": { subject: "Hindi", teacher: "Mrs. Singh" } },
    Wednesday: { "6:00-7:00": { subject: "Mathematics", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "Social Studies", teacher: "Mr. Verma" } },
    Thursday: { "6:00-7:00": { subject: "English", teacher: "Mrs. Patel" }, "7:00-8:00": { subject: "Science", teacher: "Dr. Kumar" } },
    Friday: { "6:00-7:00": { subject: "Hindi", teacher: "Mrs. Singh" }, "7:00-8:00": { subject: "Mathematics", teacher: "Mr. Sharma" } },
    Saturday: { "6:00-7:00": { subject: "Science", teacher: "Dr. Kumar" }, "7:00-8:00": { subject: "English", teacher: "Mrs. Patel" } },
  },
  7: {
    Monday: { "6:00-7:00": { subject: "Physics", teacher: "Mr. Reddy" }, "7:00-8:00": { subject: "Chemistry", teacher: "Mrs. Gupta" } },
    Tuesday: { "6:00-7:00": { subject: "Mathematics", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "Biology", teacher: "Dr. Das" } },
    Wednesday: { "6:00-7:00": { subject: "English", teacher: "Mrs. Patel" }, "7:00-8:00": { subject: "Physics", teacher: "Mr. Reddy" } },
    Thursday: { "6:00-7:00": { subject: "Chemistry", teacher: "Mrs. Gupta" }, "7:00-8:00": { subject: "Mathematics", teacher: "Mr. Sharma" } },
    Friday: { "6:00-7:00": { subject: "Biology", teacher: "Dr. Das" }, "7:00-8:00": { subject: "Hindi", teacher: "Mrs. Singh" } },
    Saturday: { "6:00-7:00": { subject: "Mathematics", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "English", teacher: "Mrs. Patel" } },
  },
  8: {
    Monday: { "6:00-7:00": { subject: "Algebra", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "Physics", teacher: "Mr. Reddy" } },
    Tuesday: { "6:00-7:00": { subject: "Chemistry", teacher: "Mrs. Gupta" }, "7:00-8:00": { subject: "Geometry", teacher: "Ms. Jain" } },
    Wednesday: { "6:00-7:00": { subject: "Biology", teacher: "Dr. Das" }, "7:00-8:00": { subject: "English", teacher: "Mrs. Patel" } },
    Thursday: { "6:00-7:00": { subject: "Algebra", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "Chemistry", teacher: "Mrs. Gupta" } },
    Friday: { "6:00-7:00": { subject: "Physics", teacher: "Mr. Reddy" }, "7:00-8:00": { subject: "Biology", teacher: "Dr. Das" } },
    Saturday: { "6:00-7:00": { subject: "Geometry", teacher: "Ms. Jain" }, "7:00-8:00": { subject: "Hindi", teacher: "Mrs. Singh" } },
  },
  9: {
    Monday: { "6:00-7:00": { subject: "Advanced Math", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "Physics", teacher: "Mr. Reddy" } },
    Tuesday: { "6:00-7:00": { subject: "Chemistry", teacher: "Mrs. Gupta" }, "7:00-8:00": { subject: "Biology", teacher: "Dr. Das" } },
    Wednesday: { "6:00-7:00": { subject: "English Lit", teacher: "Mrs. Patel" }, "7:00-8:00": { subject: "Advanced Math", teacher: "Mr. Sharma" } },
    Thursday: { "6:00-7:00": { subject: "Physics", teacher: "Mr. Reddy" }, "7:00-8:00": { subject: "Chemistry", teacher: "Mrs. Gupta" } },
    Friday: { "6:00-7:00": { subject: "Biology", teacher: "Dr. Das" }, "7:00-8:00": { subject: "Computer Science", teacher: "Mr. Tech" } },
    Saturday: { "6:00-7:00": { subject: "Advanced Math", teacher: "Mr. Sharma" }, "7:00-8:00": { subject: "English Lit", teacher: "Mrs. Patel" } },
  },
}

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
const timeSlots = ["6:00-7:00", "7:00-8:00"] as const
const allClasses = [6, 7, 8, 9]

export function TeacherDashboard({ teacherName, onLogout }: TeacherDashboardProps) {
  const [selectedClass, setSelectedClass] = useState<number>(6)
  const myAssignments = teacherAssignments[teacherName] || []

  const isMyClass = (classNum: number, teacher: string) => {
    return teacher === teacherName
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
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 glow-purple">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold gradient-text">Teacher Dashboard</h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">View all class schedules</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 bg-secondary/50 text-foreground/80 border border-border hover:bg-destructive/20 hover:text-destructive hover:border-destructive/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Welcome Section */}
          <div className="glass-card rounded-2xl p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-primary/30">
                  <User className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Welcome,</p>
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">{teacherName}</h2>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-primary/30">
                <GraduationCap className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-foreground">Teacher</span>
              </div>
            </div>

            {/* My Assignments */}
            {myAssignments.length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground mb-2">Your Assigned Classes:</p>
                <div className="flex flex-wrap gap-2">
                  {myAssignments.map((assignment, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-primary/20 text-primary text-sm font-medium"
                    >
                      Class {assignment.classNum} - {assignment.subject}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Class Selector */}
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">View Timetable</h3>
            <div className="relative ml-auto">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(Number(e.target.value))}
                className="appearance-none bg-secondary/50 border border-border rounded-xl px-4 py-2 pr-10 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
              >
                {allClasses.map((c) => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Timetable */}
          <div className="glass-card rounded-2xl p-6 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr>
                    <th className="p-3 text-left text-sm font-semibold text-muted-foreground border-b border-border/50">Time</th>
                    {days.map((day) => (
                      <th key={day} className="p-3 text-center text-sm font-semibold text-foreground border-b border-border/50">{day}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot}>
                      <td className="p-3 text-sm font-medium text-primary whitespace-nowrap border-b border-border/30">{slot}</td>
                      {days.map((day) => {
                        const cellData = timetableData[selectedClass]?.[day]?.[slot]
                        const isHighlighted = cellData && isMyClass(selectedClass, cellData.teacher)
                        return (
                          <td key={`${day}-${slot}`} className="p-2 border-b border-border/30">
                            <div
                              className={cn(
                                "p-3 rounded-xl text-center transition-all duration-300",
                                isHighlighted
                                  ? "bg-gradient-to-br from-purple-500/30 to-pink-500/30 border-2 border-primary/50 glow-purple"
                                  : "bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30"
                              )}
                            >
                              <p className="text-sm font-semibold text-foreground">{cellData?.subject}</p>
                              <p className={cn("text-xs mt-1", isHighlighted ? "text-primary font-medium" : "text-muted-foreground")}>{cellData?.teacher}</p>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Legend */}
          <div className="glass-card rounded-xl p-4 mt-4">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-primary/50" />
                <span className="text-muted-foreground">Your classes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-secondary/30" />
                <span className="text-muted-foreground">Other classes</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
