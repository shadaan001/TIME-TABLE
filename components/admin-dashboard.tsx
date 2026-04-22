"use client"

import { useState } from "react"
import {
Calendar,
LogOut,
LayoutDashboard,
Users,
GraduationCap,
Menu,
Plus,
Trash2,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AdminDashboardProps {
adminName: string
onLogout: () => void
}

type AdminTab = "dashboard" | "timetable" | "teachers" | "students"

// ✅ YOUR REAL TEACHERS (EDIT FREELY)
const initialTeachers = [
{
id: 1,
name: "Atif Sir",
subjects: ["Mathematics"],
classes: [6, 7, 8],
},
{
id: 2,
name: "Zaid Sir",
subjects: ["Science"],
classes: [8, 9, 10],
},
{
id: 3,
name: "Umera Maam",
subjects: ["English"],
classes: [6, 7],
},
]

// ✅ YOUR REAL STUDENTS (EDIT FREELY)
const initialStudents = [
{ id: 1, name: "Ayaan", classNum: 6 },
{ id: 2, name: "Rehan", classNum: 7 },
{ id: 3, name: "Ali", classNum: 8 },
{ id: 4, name: "Faizan", classNum: 9 },
{ id: 5, name: "Sameer", classNum: 10 },
]

export function AdminDashboard({ adminName, onLogout }: AdminDashboardProps) {
const [activeTab, setActiveTab] = useState<AdminTab>("dashboard")
const [sidebarOpen, setSidebarOpen] = useState(false)

// ✅ SAFE LOCAL STATE
const [teachers, setTeachers] = useState(initialTeachers)
const [students, setStudents] = useState(initialStudents)

const [newStudentName, setNewStudentName] = useState("")
const [newStudentClass, setNewStudentClass] = useState(6)

const [newTeacherName, setNewTeacherName] = useState("")

// ✅ ADD STUDENT (SAFE)
const handleAddStudent = () => {
if (!newStudentName.trim()) return

setStudents([
  ...students,
  {
    id: Date.now(),
    name: newStudentName,
    classNum: newStudentClass,
  },
])

setNewStudentName("")

}
// ✅ DELETE STUDENT
const handleDeleteStudent = (id: number) => {
  setStudents(students.filter((s) => s.id !== id))
}
// ✅ DELETE TEACHER
const handleDeleteTeacher = (id: number) => {
  setTeachers(teachers.filter((t) => t.id !== id))
}

// ✅ ADD TEACHER
const handleAddTeacher = () => {
if (!newTeacherName.trim()) return


setTeachers([
  ...teachers,
  {
    id: Date.now(),
    name: newTeacherName,
    subjects: [],
    classes: [],
  },
])

setNewTeacherName("")
}

return (
  <div className="min-h-screen bg-gradient-purple flex">
    
    {/* Sidebar */}
    <aside className="w-64 p-4">
      <h1 className="text-xl font-bold mb-4">Admin Panel</h1>

      <button onClick={() => setActiveTab("dashboard")}>Dashboard</button>
      <button onClick={() => setActiveTab("teachers")}>Teachers</button>
      <button onClick={() => setActiveTab("students")}>Students</button>

      <button onClick={onLogout} className="text-red-500 mt-4">
        Logout
      </button>
    </aside>

    <main className="flex-1 p-6">

      {activeTab === "dashboard" && (
        <div>
          <h2>Dashboard</h2>
          <p>Total Students: {students.length}</p>
          <p>Total Teachers: {teachers.length}</p>
        </div>
      )}

      {activeTab === "teachers" && (
        <div>
          <h2>Teachers</h2>

          <input
            value={newTeacherName}
            onChange={(e) => setNewTeacherName(e.target.value)}
            placeholder="Teacher Name"
          />
          <button onClick={handleAddTeacher}>Add</button>

          {teachers.map((t) => (
            <div key={t.id}>
              {t.name}
              <button onClick={() => handleDeleteTeacher(t.id)}>❌</button>
            </div>
          ))}
        </div>
      )}

      {activeTab === "students" && (
        <div>
          <h2>Students</h2>

          <input
            value={newStudentName}
            onChange={(e) => setNewStudentName(e.target.value)}
            placeholder="Student Name"
          />

          <select
            value={newStudentClass}
            onChange={(e) => setNewStudentClass(Number(e.target.value))}
          >
            {[6, 7, 8, 9, 10].map((c) => (
              <option key={c} value={c}>
                Class {c}
              </option>
            ))}
          </select>

          <button onClick={handleAddStudent}>Add</button>

          {students.map((s) => (
            <div key={s.id}>
              {s.name} (Class {s.classNum})
              <button onClick={() => handleDeleteStudent(s.id)}>❌</button>
            </div>
          ))}
        </div>
      )}

    </main>
  </div>
) }