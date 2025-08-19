"use client"

import { useSession, signOut } from "next-auth/react"
import Head from "next/head"

export default function Home() {
  return (
    <HomeContent />
  )
}

function HomeContent() {
  const { data: session, status } = useSession()

  if (status === "loading") return <p>Loading...</p>
  console.log(session)
  return (
    <>
      <Head>
        <title>META - Connect Instantly, Chat Securely</title>
        <meta
          name="description"
          content="Connect instantly with friends and colleagues. Send messages, create groups, and stay connected anytime, anywhere with ChatApp."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50 font-sans antialiased text-gray-800">
        {session ? (
          // Show user profile
          <div className="flex flex-col items-center justify-center gap-4 flex-grow">
            <h2 className="text-3xl font-bold">
              Welcome, {session?.user?.name || "User"}!
            </h2>
            <p className="text-lg text-gray-700">Email: {session?.user?.email}</p>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-6 py-3 mt-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Sign Out
            </button>
            <div>THIS IS ONLY FOR TRIAL</div>
            <a href="/friendreq" className="text-blue-600 hover:underline bg-amber-400 rounded m-2 p-2">Go to Friend Requests</a>
            <a href="/friendlist" className="text-blue-600 hover:underline bg-amber-400 rounded m-2 p-2">Go to Friend List</a>
            <a href="/chatpage" className="text-blue-600 hover:underline bg-amber-400 rounded m-2 p-2">Go to Chatting Area</a>

          </div>
        ) : (
          // Hero Section for guests
          <section className="flex flex-col-reverse lg:flex-row items-center justify-center px-6 sm:px-12 py-24 gap-16 lg:gap-32 flex-grow max-w-7xl mx-auto w-full">
            {/* Text content */}
            <div className="flex-1 text-center lg:text-left space-y-8 animate-fade-in-up">
              <h1 className="text-6xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                <span className="block text-blue-600 drop-shadow-md">ChatApp</span>
                Your World,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Connected
                </span>
                .
              </h1>
              <p className="text-gray-700 text-xl max-w-md mx-auto lg:mx-0 leading-relaxed">
                Connect instantly with friends and colleagues. Send messages, create groups, and stay connected anytime, anywhere.
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-5 mt-10">
                <a
                  href="/signin"
                  className="px-8 py-4 bg-blue-600 text-white font-bold rounded-full shadow-xl hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-75"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-8 py-4 border-2 border-gray-300 text-gray-800 font-semibold rounded-full hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-gray-200 focus:ring-opacity-75"
                >
                  Sign Up
                </a>
              </div>
            </div>

            {/* Illustration / Placeholder */}
            <div className="flex-1 flex justify-center items-center p-4">
              <div className="relative w-[420px] h-[420px] bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full shadow-2xl flex items-center justify-center animate-blob transform transition-transform duration-1000 ease-in-out hover:scale-105 group">
                <div className="absolute inset-4 rounded-full bg-white opacity-10 blur-xl"></div>
                <svg
                  className="w-56 h-56 text-blue-600 opacity-75 group-hover:text-blue-700 transition-colors duration-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 14v-2h8v2H6zm10 0h2v-2h-2v2zm0-4h2V8h-2v2zM6 8h8v2H6V8z" />
                </svg>
              </div>
            </div>
          </section>
        )}
      </div>
    </>
  )
}
