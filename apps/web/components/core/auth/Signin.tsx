"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Nav from "@/components/ui/nav";
export default function Signin() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState("light");

  // Load theme
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    setTheme(saved);
    document.documentElement.classList.toggle("dark", saved === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: "/",
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 transition-colors">
      <Nav toggleTheme={toggleTheme} theme={theme} />
      {/* Dark mode toggle */}
      
      <Card className="w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign In
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Access your account securely
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="flex flex-col space-y-4">
            <div>
              <Label htmlFor="email" className="dark:text-gray-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <div>
              <Label htmlFor="password" className="dark:text-gray-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="py-3 px-4 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </CardContent>

          <CardFooter className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full py-3 border border-gray-400 hover:border-gray-300 hover:bg-[var(--special)]"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full py-3 border border-gray-400 hover:scale-105 hover:cursor-pointer]"
              onClick={() => signIn("github", { callbackUrl: "/" })}
            >
              Sign In with GitHub
            </Button>
            <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-3">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Create one
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
