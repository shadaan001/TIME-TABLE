"use client"

import Timetable from "@/components/timetable"

export function Dashboard({
  studentName,
  classNum,
  fullClass,
  onLogout,
}: {
  studentName: string
  classNum: number | string
  fullClass: string
  onLogout: () => void
}) {
  return (
    <div className="min-h-screen bg-gradient-purple p-6 text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome, {studentName}
        </h1>

        <button
          onClick={onLogout}
          className="bg-red-500 px-4 py-2 rounded-xl"
        >
          Logout
        </button>
      </div>

      {/* Class */}
      <h2 className="text-lg mb-4">{fullClass}</h2>

      {/* Timetable */}
      <Timetable className={fullClass} />
    </div>
  )
}