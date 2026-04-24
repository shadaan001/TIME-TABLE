"use client"

import { TeacherDashboard } from "@/components/teacher-dashboard"

export default function Home() {
  return (
    <TeacherDashboard
      teacherName="Coaching Timetable"
      onLogout={() => {}}
    />
  )
}