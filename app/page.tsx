"use client"

import { useState, useEffect } from "react"
import { Login, type UserRole } from "@/components/login"
import { Dashboard } from "@/components/dashboard"
import { TeacherDashboard } from "@/components/teacher-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"

interface UserSession {
  name: string
  classNum: string | number | null
  role: UserRole
}

export default function Home() {
  const [session, setSession] = useState<UserSession | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const savedSession = sessionStorage.getItem("coaching-session")
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession))
      } catch {
        sessionStorage.removeItem("coaching-session")
      }
    }
    setIsLoaded(true)
  }, [])

  const handleLogin = (
    name: string,
    classNum: string | number | null,
    role: UserRole,
    password: string
  ) => {
    const newSession = { name, classNum, role }
    setSession(newSession)
    sessionStorage.setItem("coaching-session", JSON.stringify(newSession))
  }

  const handleLogout = () => {
    setSession(null)
    sessionStorage.removeItem("coaching-session")
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-purple flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  if (session) {
    switch (session.role) {
      case "student":
        return (
          <Dashboard
            studentName={session.name}
            classNum={session.classNum!}
            fullClass={
              typeof session.classNum === "number"
                ? `Class ${session.classNum}`
                : session.classNum === "11-science"
                ? "Class 11 Science"
                : "Class 11 Commerce"
            }
            onLogout={handleLogout}
          />
        )

      case "teacher":
        return (
          <TeacherDashboard
            teacherName={session.name}
            onLogout={handleLogout}
          />
        )

      case "admin":
        return (
          <AdminDashboard
            adminName={session.name}
            onLogout={handleLogout}
          />
        )
    }
  }

  return <Login onLogin={handleLogin} />
}