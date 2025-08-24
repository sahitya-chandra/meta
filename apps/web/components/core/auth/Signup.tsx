"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { signIn } from "next-auth/react"
import Nav from "@/components/ui/nav"
import Loader from "@/components/ui/loader" // ✅ import Loader

export default function Signup() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [theme, setTheme] = useState("light")
  const [themeLoading, setThemeLoading] = useState(true) // ✅ new state

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light"
    setTheme(saved)
    document.documentElement.classList.toggle("dark", saved === "dark")
    setThemeLoading(false) // ✅ done loading
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Something went wrong")
      }

      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      })

      if (result?.error) {
        setError("Signup failed, please try again.")
      } else {
        router.replace("/")
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  // ✅ Show Loader while theme is loading
  if (themeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4 transition-colors">
      <Nav toggleTheme={toggleTheme} theme={theme} />
      <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-800">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Your Account
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Sign up to start chatting instantly
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <Input
              placeholder="Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="py-3 px-4 dark:bg-gray-700 dark:text-gray-100"
            />
            <Input
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-3 px-4 dark:bg-gray-700 dark:text-gray-100"
            />
            <Input
              placeholder="Password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="py-3 px-4 dark:bg-gray-700 dark:text-gray-100"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button type="submit" disabled={loading} className="w-full py-3 border border-gray-400 hover:border-gray-300 hover:bg-[var(--special)]">
              {loading ? "Creating account..." : "Create Account"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full py-3 border border-gray-400 hover:scale-105 hover:cursor-pointer"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              Sign Up with GitHub
            </Button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
              Already have an account?{" "}
              <Link href="/signin" className="text-blue-600 dark:text-blue-400 hover:underline">
                Sign In
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
