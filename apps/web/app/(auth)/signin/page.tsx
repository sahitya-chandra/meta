"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn } from "next-auth/react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Redirect if already signed in
  useEffect(() => {
    if (session) router.replace("/")
  }, [session, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/",
    })
  }

  if (status === "loading") return <p>Loading...</p>

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
          <CardDescription className="text-gray-600">Access your account securely</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="email"></Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 px-4"
              />
            </div>
            <div>
              <Label htmlFor="password"></Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-3 px-4"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button type="submit" className="w-full py-3">
              Sign In
            </Button>
            <Button variant="outline" className="w-full bg-transparent py-3" onClick={() => signIn("github", { callbackUrl: "/" })}>
              Sign In with GitHub
            </Button>
            <p className="text-center text-sm text-gray-500 mt-3">
              Don’t have an account?{" "}
              <Link href="/signup" className="text-blue-600 hover:underline">
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
