"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Nav from "@/components/ui/nav";

export default function FriendList({ token }: { token: string }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

  const userId = session?.user?.id;

  // Theme persistence
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      if (saved) {
        setTheme(saved);
        document.documentElement.classList.toggle("dark", saved === "dark");
      }
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

  // Fetch friends
  useEffect(() => {
    if (!userId || !token) return;
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [userId, token]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Nav toggleTheme={toggleTheme} theme={theme} />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <h1 className="text-3xl font-bold mb-6">Your Friends</h1>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader />
          </div>
        ) : friends.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
            <p className="text-lg text-muted-foreground">You don’t have any friends yet.</p>
            <a
              href="/friendreq"
              className="px-6 py-2 bg-[var(--special)] text-background rounded-lg font-semibold hover:opacity-90 transition"
            >
              Find Friends
            </a>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {friends.map((friend) => (
              <li
                key={friend.id}
                className="flex flex-col justify-between bg-muted rounded-xl p-5 shadow-md hover:shadow-lg transition"
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {friend.name || "Unnamed"}
                  </h2>
                  <p className="text-sm text-muted-foreground">{friend.email}</p>
                </div>
                <a
                  href={`/chatpage?user=${friend.id}`}
                  className="mt-4 px-4 py-2 text-center bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
                >
                  Chat
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
