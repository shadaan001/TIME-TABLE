"use client"
import { supabase } from "@/lib/supabase"
import { useState } from "react"
import { User, GraduationCap, LogIn, Lock, UserCog, BookOpen, Shield } from "lucide-react"
import { cn } from "@/lib/utils"

export type UserRole = "student" | "teacher" | "admin"

interface LoginProps {
  onLogin: (
    name: string,
    classNum: string | number | null, // ✅ FIXED
    role: UserRole,
    password: string
  ) => void;
}

const classes: { id: number | string; label: string }[] = [
  { id: 6, label: "6" },
  { id: 7, label: "7" },
  { id: 8, label: "8" },
  { id: 9, label: "9" },
  { id: 10, label: "10" },
  { id: "11-science", label: "11 Sci" },
  { id: "11-commerce", label: "11 Com" },
]

const roles: { id: UserRole; label: string; icon: React.ReactNode }[] = [
  { id: "student", label: "Student", icon: <BookOpen className="w-4 h-4" /> },
  { id: "teacher", label: "Teacher", icon: <UserCog className="w-4 h-4" /> },
  { id: "admin", label: "Admin", icon: <Shield className="w-4 h-4" /> },
]

export function Login({ onLogin }: LoginProps) {
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [selectedClass, setSelectedClass] = useState<string | number | null>(null) // ✅ FIXED
  const [selectedRole, setSelectedRole] = useState<UserRole>("student")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !password.trim()) return
    if (selectedRole === "student" && !selectedClass) return

    setIsLoading(true)

    const { data, error } = await supabase
  .from("users")
  .select("*")
  .eq("name", name.trim())
  .single()

if (error || !data) {
  alert("User not found ❌")
  setIsLoading(false)
  return
}

if (data.password !== password) {
  alert("Wrong password ❌")
  setIsLoading(false)
  return
}

if (data.role !== selectedRole) {
  alert("Wrong role ❌")
  setIsLoading(false)
  return
}

onLogin(
  data.name,
  data.role === "student" ? data.class_name : null,
  data.role,
  password
)

setIsLoading(false)

    // ✅ FIXED TYPE SAFE CALL
    onLogin(
      name.trim(),
      selectedRole === "student" ? selectedClass : null,
      selectedRole,
      password
    )

    setIsLoading(false)
  }

  const isFormValid =
    name.trim() &&
    password.trim() &&
    (selectedRole !== "student" || selectedClass)

  return (
    <div className="min-h-screen bg-gradient-purple flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="glass-card rounded-3xl p-8 shadow-2xl glow-purple">

          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 mb-4 glow-purple">
              <GraduationCap className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold gradient-text mb-2">
              Coaching Timetable
            </h1>
            <p className="text-muted-foreground text-sm">
              Sign in to access the system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Role */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Select Role
              </label>

              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={cn(
                      "py-2.5 px-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center justify-center gap-2",
                      selectedRole === role.id
                        ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white glow-purple"
                        : "bg-secondary/50 text-foreground/70 border border-border"
                    )}
                  >
                    {role.icon}
                    {role.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground/80">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-secondary/50 border border-border rounded-xl"
                  required
                />
              </div>
            </div>

            {/* Class */}
            {selectedRole === "student" && (
              <div className="grid grid-cols-4 gap-2">
                {classes.map((cls) => (
                  <button
                    key={cls.id}
                    type="button"
                    onClick={() => setSelectedClass(cls.id)}
                    className={cn(
                      "py-2 rounded-xl",
                      selectedClass === cls.id
                        ? "bg-purple-600 text-white"
                        : "bg-secondary/50"
                    )}
                  >
                    {cls.label}
                  </button>
                ))}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-500 text-white"
            >
              {isLoading ? "Loading..." : "Login"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}