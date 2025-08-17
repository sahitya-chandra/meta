"use client"

import { useSession, signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"

export default function SignUpPage() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    await signIn("credentials", {
      redirect: true,
      email,
      password,
      callbackUrl: "/",
    })
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md shadow-xl border border-gray-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Create Your Account</CardTitle>
          <CardDescription className="text-gray-600">Sign up to start chatting instantly</CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col space-y-4">
          <Input placeholder="Email" type="email" className="py-3 px-4" onChange={(e) => { setEmail(e.target.value) }} />
          <Input placeholder="Password" type="password" className="py-3 px-4" onChange={(e) => { setPassword(e.target.value) }} />

          <Button variant="default" className="w-full py-3" onClick={handleSubmit}>
            Create Account
          </Button>
          <Button variant="outline" className="w-full bg-transparent py-3" onClick={() => signIn("github")}>
            Sign In with GitHub
          </Button>

          <p className="text-center text-sm text-gray-500 mt-2">
            Already have an account?{" "}
            <Link href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
