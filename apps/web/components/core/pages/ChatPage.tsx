"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Nav from "@/components/ui/nav";

const ChatPage = ({ token }: { token: string }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");

  const userId = session?.user?.id;

  // Handle friend click
  const handleSelectFriend = (id: string) => {
    setActiveChatId(id);
  };

  // Theme handling
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
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
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/friends`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setFriends(data || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId, token]);

  // Loading screen
  if (loading) return <Loader />;

  return (
    <div
      className="grid grid-rows-[60px_1fr] h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      <Nav toggleTheme={toggleTheme} theme={theme} />

      {/* Body */}
      <div className="grid grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <aside
          className="flex flex-col"
          style={{
            background: "var(--muted)",
            borderRight: "1px solid var(--muted-foreground)",
          }}
        >
          <div
            className="p-4 font-semibold"
            style={{ borderBottom: "1px solid var(--muted-foreground)" }}
          >
            Friends
          </div>
          <ul className="flex-1 overflow-y-auto">
            {friends.length === 0 ? (
              <p className="p-3" style={{ color: "var(--muted-foreground)" }}>
                No friends yet
              </p>
            ) : (
              friends.map((friend) => (
                <li
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend.id)}
                  className="p-3 cursor-pointer rounded transition-colors"
                  style={{
                    background:
                      activeChatId === friend.id
                        ? "var(--special)"
                        : "transparent",
                    color:
                      activeChatId === friend.id
                        ? "var(--background)"
                        : "var(--foreground)",
                  }}
                >
                  {friend.name || friend.email}
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Chat area */}
        <main className="flex flex-col">
          {activeChatId === "" ? (
            <div
              className="flex-1 flex items-center justify-center text-center"
              style={{ color: "var(--muted-foreground)" }}
            >
              Select a friend to start chatting
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div
                className="p-4 font-semibold"
                style={{
                  background: "var(--muted)",
                  borderBottom: "1px solid var(--muted-foreground)",
                }}
              >
                Chat with{" "}
                {friends.find((f) => f.id === activeChatId)?.name || "Friend"}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {/* Sample messages */}
                <div
                  className="p-2 rounded-lg w-fit"
                  style={{ background: "var(--muted)" }}
                >
                  Hi there!
                </div>
                <div
                  className="p-2 rounded-lg w-fit ml-auto"
                  style={{
                    background: "var(--special)",
                    color: "var(--background)",
                  }}
                >
                  Hello 👋
                </div>
              </div>

              {/* Message input */}
              <form
                className="p-4 flex gap-2"
                style={{ borderTop: "1px solid var(--muted-foreground)" }}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!message.trim()) return;
                  console.log("Send:", message);
                  setMessage("");
                }}
              >
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 rounded-full px-4 py-2 focus:outline-none"
                  style={{
                    background: "var(--muted)",
                    color: "var(--foreground)",
                    border: "1px solid var(--muted-foreground)",
                  }}
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-full font-medium"
                  style={{
                    background: "var(--special)",
                    color: "var(--background)",
                  }}
                >
                  Send
                </button>
              </form>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ChatPage;
