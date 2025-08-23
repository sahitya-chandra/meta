"use client"

import Loader from "@/components/ui/loader"
import Nav from "@/components/ui/nav"
import { useSession, signOut } from "next-auth/react"
import Head from "next/head"
import { useEffect, useState } from "react"

export default function Home() {
  return <HomeContent />
}

function HomeContent() {
  const { data: session, status } = useSession()
  const [theme, setTheme] = useState("light")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme")
      if (saved) {
        setTheme(saved)
        document.documentElement.classList.toggle("dark", saved === "dark")
      }
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark"
    setTheme(newTheme)
    document.documentElement.classList.toggle("dark", newTheme === "dark")
    localStorage.setItem("theme", newTheme)
  }

  if (status === "loading") return <Loader />

  return (
    <>
      <Head>
        <title>ChatApp</title>
        <meta name="description" content="Connect instantly, chat securely with ChatApp." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-background font-sans antialiased text-foreground relative transition-colors overflow-hidden">
        {theme === "dark" && <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />}

        <Nav toggleTheme={toggleTheme} theme={theme} />

        {session ? (
          <div className="flex flex-col items-center justify-center flex-grow p-4 sm:p-12 w-full max-w-7xl mx-auto mt-20 animate-fade-in z-10">
            <div className="bg-background/60 rounded-2xl shadow-xl p-8 sm:p-12 w-full max-w-xl text-center backdrop-blur-sm">
              <h2 className="text-4xl font-bold mb-2">
                Welcome, <span className="text-[var(--special)]">{session?.user?.name || "User"}</span>!
              </h2>
              <p className="text-lg text-muted-foreground mb-8">Ready to chat? Select an option below.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                <a href="/friendreq" className="group block p-6 rounded-xl border border-muted bg-background hover:shadow-lg hover:-translate-y-1 transition-all">
                  <h3 className="text-lg font-semibold group-hover:text-[var(--special)]">Friend Requests</h3>
                  <p className="text-sm text-muted-foreground mt-1">Manage incoming requests.</p>
                </a>
                <a href="/friendlist" className="group block p-6 rounded-xl border border-muted bg-background hover:shadow-lg hover:-translate-y-1 transition-all">
                  <h3 className="text-lg font-semibold group-hover:text-[var(--special)]">Friend List</h3>
                  <p className="text-sm text-muted-foreground mt-1">See who you&apos;re connected with.</p>
                </a>
                <a href="/chatpage" className="group block col-span-1 md:col-span-2 p-6 rounded-xl bg-[var(--special)] text-background hover:shadow-lg hover:opacity-90 transition-all">
                  <h3 className="text-lg font-bold">Go to Chat</h3>
                  <p className="text-sm mt-1 opacity-90">Start a conversation now.</p>
                </a>
              </div>
              
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="mt-8 w-full px-6 py-3 rounded-lg font-semibold bg-muted text-foreground hover:bg-muted-foreground hover:text-background transition-colors shadow-sm"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center flex-grow text-center w-full mt-20 z-10">
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
              <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight animate-fade-in-down">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--special)] to-blue-600 drop-shadow-md">Connect</span>{" "}
                  Instantly, Chat <span className="text-[var(--special)]">Securely</span>.
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-in-up">
                  The simplest way to connect with friends, family, and colleagues. Fast, private, and always available.
                </p>
                <div className="pt-6 flex justify-center gap-4 animate-fade-in-up">
                  <a href="/signin" className="px-8 py-4 rounded-full bg-[var(--special)] text-background font-bold shadow-md hover:shadow-lg hover:-translate-y-1 transition-all">
                    Sign in
                  </a>
                  <a href="/signup" className="px-8 py-4 rounded-full border-2 border-white text-foreground font-semibold hover:bg-muted  hover:-translate-y-1 transition-all bg-[var(--background)]">
                    Sign up
                  </a>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}