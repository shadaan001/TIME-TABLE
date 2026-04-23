"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface AdminDashboardProps {
  adminName: string
  onLogout: () => void
}

type Tab = "dashboard" | "teachers" | "students" | "timetable"

interface Row {
  id: string
  class_name: string
  day: string
  subject: string
  slot: string | null
  time: string | null
  teacher: string | null
}

export default function AdminDashboard({ adminName, onLogout }: AdminDashboardProps) {
  const [teachers, setTeachers] = useState<any[]>([])
const [students, setStudents] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<Tab>("dashboard")
  const [selectedClass, setSelectedClass] = useState("Class 6")
  const [data, setData] = useState<Row[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editData, setEditData] = useState<any>({})
 const fetchTeachers = async () => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("role", "teacher")

  setTeachers(data || [])
}

const fetchStudents = async () => {
  const { data } = await supabase
    .from("users")
    .select("*")
    .eq("role", "student")

  setStudents(data || [])
}

  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"]

 useEffect(() => {
  if (activeTab === "timetable") fetchData()
  if (activeTab === "teachers") fetchTeachers()
  if (activeTab === "students") fetchStudents()
}, [selectedClass, activeTab])

  const fetchData = async () => {
    const { data } = await supabase
      .from("timetable")
      .select("*")
      .eq("class_name", selectedClass)

    setData(data || [])
  }

  const handleEdit = (row: Row) => {
    setEditingId(row.id)
    setEditData(row)
  }

  const handleSave = async () => {
    await supabase
      .from("timetable")
      .update({
        subject: editData.subject,
        slot: editData.slot,
        time: editData.time,
        teacher: editData.teacher,
      })
      .eq("id", editingId)

    setEditingId(null)
    fetchData()
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-purple-900 to-black text-white">

      {/* SIDEBAR */}
      <div className="w-64 p-6 border-r border-purple-700">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

       <div className="flex flex-col gap-3 mt-4">

  <button
    onClick={() => setActiveTab("dashboard")}
    className={`px-4 py-2 rounded-lg text-left transition ${
      activeTab === "dashboard"
        ? "bg-purple-600"
        : "hover:bg-purple-700"
    }`}
  >
    Dashboard
  </button>

  <button
    onClick={() => setActiveTab("teachers")}
    className={`px-4 py-2 rounded-lg text-left transition ${
      activeTab === "teachers"
        ? "bg-purple-600"
        : "hover:bg-purple-700"
    }`}
  >
    Teachers
  </button>

  <button
    onClick={() => setActiveTab("students")}
    className={`px-4 py-2 rounded-lg text-left transition ${
      activeTab === "students"
        ? "bg-purple-600"
        : "hover:bg-purple-700"
    }`}
  >
    Students
  </button>

  <button
    onClick={() => setActiveTab("timetable")}
    className={`px-4 py-2 rounded-lg text-left transition ${
      activeTab === "timetable"
        ? "bg-purple-600"
        : "hover:bg-purple-700"
    }`}
  >
    Timetable
  </button>

</div>

        <button onClick={onLogout} className="text-red-400 mt-10">Logout</button>
      </div>

      {/* MAIN */}
      <div className="flex-1 p-8">

        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <div>
            <h2 className="text-3xl mb-4">Welcome, {adminName}</h2>
            <p>Manage your coaching system easily.</p>
          </div>
        )}
{activeTab === "teachers" && (
  <div>
    <h2 className="text-2xl mb-6 font-bold">Teachers</h2>

    {/* ADD TEACHER */}
    <div className="flex gap-3 mb-6">
      <input
        placeholder="Teacher Name"
        value={editData.teacher || ""}
        onChange={(e) =>
          setEditData({ ...editData, teacher: e.target.value })
        }
        className="p-2 rounded text-black w-64"
      />

      <button
        onClick={async () => {
          if (!editData.teacher) return

          await supabase.from("teachers").insert({
            name: editData.teacher,
          })

          setEditData({})
          alert("Teacher Added ✅")
        }}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Add
      </button>
    </div>

    {/* LIST */}
    <div className="grid grid-cols-2 gap-4">
      {data.map((t: any) => (
        <div
          key={t.id}
          className="bg-purple-800 p-4 rounded-xl flex justify-between items-center"
        >
          <span>{t.teacher || "Unnamed"}</span>

          <button
            onClick={async () => {
              await supabase.from("timetable").delete().eq("id", t.id)
              fetchData()
            }}
            className="bg-red-500 px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
)}

 {activeTab === "students" && (
  <div>
    <h2 className="text-2xl mb-6 font-bold">Students</h2>

    {/* ADD STUDENT */}
    <div className="flex gap-3 mb-6">
      <input
        placeholder="Student Name"
        value={editData.student || ""}
        onChange={(e) =>
          setEditData({ ...editData, student: e.target.value })
        }
        className="p-2 rounded text-black w-64"
      />

      <select
        onChange={(e) =>
          setEditData({ ...editData, class_name: e.target.value })
        }
        className="p-2 rounded text-black"
      >
        <option>Select Class</option>
        <option>Class 6</option>
        <option>Class 7</option>
        <option>Class 8</option>
        <option>Class 9</option>
        <option>Class 10</option>
        <option>Class 11</option>
        <option>Class 11 Commerce</option>
      </select>

      <button
        onClick={async () => {
          if (!editData.student || !editData.class_name) return

          await supabase.from("students").insert({
            name: editData.student,
            class_name: editData.class_name,
          })

          setEditData({})
          alert("Student Added ✅")
        }}
        className="bg-green-500 px-4 py-2 rounded"
      >
        Add
      </button>
    </div>

    {/* LIST */}
    <div className="grid grid-cols-2 gap-4">
      {data.map((s: any) => (
        <div
          key={s.id}
          className="bg-purple-800 p-4 rounded-xl flex justify-between items-center"
        >
          <span>
            {s.name || "Unnamed"} ({s.class_name})
          </span>

          <button
            onClick={async () => {
              await supabase.from("students").delete().eq("id", s.id)
              fetchData()
            }}
            className="bg-red-500 px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        {/* TIMETABLE */}
        {activeTab === "timetable" && (
          <div>
            <h2 className="text-2xl mb-6">Timetable Editor</h2>

            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-black p-2 rounded mb-6"
            >
              {[
                "Class 6","Class 7","Class 8",
                "Class 9","Class 10",
                "Class 11","Class 11 Commerce"
              ].map(c => <option key={c}>{c}</option>)}
            </select>

            {/* GRID VIEW LIKE STUDENT */}
            <div className="grid grid-cols-7 gap-4">
              {days.map(day => {
                const dayData = data.filter(d => d.day === day)

                return (
                  <div key={day} className="bg-purple-800 p-4 rounded-xl min-h-[200px]">
                    <h3 className="mb-3 font-bold">{day}</h3>

                    {dayData.map(row => (
                      <div key={row.id} className="bg-purple-700 p-3 rounded-lg mb-3">

                        {editingId === row.id ? (
                          <>
                            <input
                              value={editData.subject}
                              onChange={e => setEditData({...editData, subject:e.target.value})}
                              className="text-black mb-1 w-full"
                            />

                            <input
                              value={editData.slot || ""}
                              onChange={e => setEditData({...editData, slot:e.target.value})}
                              className="text-black mb-1 w-full"
                            />

                            <input
                              value={editData.teacher || ""}
                              onChange={e => setEditData({...editData, teacher:e.target.value})}
                              className="text-black mb-2 w-full"
                            />

                            <button onClick={handleSave} className="bg-green-500 px-2 py-1 rounded">
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <p>{row.subject}</p>
                            <p className="text-sm">{row.slot || row.time}</p>
                            <p className="text-xs">{row.teacher}</p>

                            <button
                              onClick={() => handleEdit(row)}
                              className="mt-2 bg-blue-500 px-2 py-1 rounded text-xs"
                            >
                              Edit
                            </button>
                          </>
                        )}

                      </div>
                    ))}

                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}