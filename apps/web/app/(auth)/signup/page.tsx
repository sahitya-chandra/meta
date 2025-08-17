"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
          <CardDescription>Get started by signing in to your account</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <Link href="/signin">
            <Button className="w-full">Sign In</Button>
          </Link>
          <Button variant="outline" className="w-full bg-transparent">
            Create Account
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
