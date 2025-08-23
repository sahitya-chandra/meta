"use client"

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Nav from "@/components/ui/nav";
import { useChat } from "@/hooks/useChat";
import { Friend, Message } from "@/lib/types";

const ChatPage = ({ token }: { token: string | undefined }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");
  const [allChats, setAllChats] = useState<Message[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const userId: string = session?.user?.id as string;
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { messages, typingUser, sendMessage, sendTyping, onlineUsers } =
    useChat(userId, token);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  };

  const handleSelectFriend = (id: string) => {
    if(id === activeChatId) return
    setActiveChatId(id);
    setAllChats([]);
    setSidebarOpen(false); // close sidebar on mobile
  };

  useEffect(() => {
    if (!activeChatId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages?friendId=${activeChatId}&since=${since}`,
          { 
            method: "GET",
            headers: { Authorization: `Bearer ${token}` } 
          }
        );
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
        const data = await res.json();
        setAllChats(
          data.filter((msg: Message) => !messages.some((m) => m.id === msg.id))
        );
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChatId, token]);

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

  useEffect(() => {
    if (!userId || !token) return;

    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/friends`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (!res.ok) throw new Error(`HTTP error! ${res.status}`);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !activeChatId) return;
    sendMessage(activeChatId, message);
    setMessage("");
  };

  const uniqueMessages = useMemo(
    () =>
      [...allChats, ...messages]
        .filter(
          (msg, index, self) => index === self.findIndex((m) => m.id === msg.id)
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
    [allChats, messages]
  );

  useEffect(() => {
    if (activeChatId) scrollToBottom("auto");
  }, [activeChatId]);

  useEffect(() => {
    scrollToBottom("smooth");
  }, [uniqueMessages.length]);

  const memoizedFriends = useMemo(
    () =>
      friends.map((friend) => ({
        ...friend,
        isOnline: onlineUsers.includes(friend.id),
      })),
    [friends, onlineUsers]
  );

  if (loading) return <Loader />;

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: "var(--background)", color: "var(--foreground)" }}
    >
      {/* Navbar with sidebar toggle for mobile */}
      <Nav toggleTheme={toggleTheme} theme={theme}>
        <button
          className="sm:hidden px-3 py-1 rounded bg-[var(--special)] text-[var(--background)] ml-2"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? "Close" : "Friends"}
        </button>
      </Nav>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden min-h-0 relative">
        {/* Sidebar */}
        <aside
          className={`absolute sm:static z-30 top-0 left-0 h-full w-64 flex-col min-h-0 transform bg-[var(--muted)] border-r border-[var(--muted-foreground)] transition-transform duration-300 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        >
          <div
            className="p-5 font-semibold"
            style={{ borderBottom: "1px solid var(--muted-foreground)" }}
          >
            Friends
          </div>
          <ul className="flex-1 overflow-y-auto no-scrollbar">
            {memoizedFriends.length === 0 ? (
              <p className="p-3" style={{ color: "var(--muted-foreground)" }}>
                No friends yet
              </p>
            ) : (
              memoizedFriends.map((friend) => (
                <li
                  key={friend.id}
                  onClick={() => handleSelectFriend(friend.id)}
                  className="p-3 cursor-pointer rounded transition-colors flex items-center gap-2"
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
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: friend.isOnline ? "#22c55e" : "#ef4444",
                    }}
                  />
                  {friend.name || friend.email}
                </li>
              ))
            )}
          </ul>
        </aside>

        {/* Chat Area */}
        <main className="relative flex flex-col flex-1 min-h-0 w-full">
          {/* Background */}
          {theme === "light" ? (
            <div className="absolute inset-0 w-full h-full bg-white bg-[repeating-linear-gradient(45deg,#d1d5db_0px,#d1d5db_2px,transparent_2px,transparent_24px)] bg-[size:24px_24px] opacity-50 pointer-events-none" />
          ) : (
            <div className="absolute inset-0 w-full h-full bg-black bg-[repeating-linear-gradient(45deg,#52525b_0px,#52525b_2px,transparent_2px,transparent_24px)] bg-[size:24px_24px] opacity-20 pointer-events-none" />
          )}

          {activeChatId === "" ? (
            <div
              className="flex-1 flex items-center justify-center text-center relative z-10"
              style={{ color: "var(--muted-foreground)" }}
            >
              Select a friend to start chatting
            </div>
          ) : (
            <>
              {/* Chat Header */}
              <div
                className="p-4 font-semibold relative z-10"
                style={{
                  background: "var(--muted)",
                  borderBottom: "1px solid var(--muted-foreground)",
                }}
              >
                Chat with{" "}
                {memoizedFriends.find((f) => f.id === activeChatId)?.name ||
                  "Friend"}
              </div>

              {/* Messages */}
              <div className="flex-1 min-h-0 p-4 overflow-y-auto space-y-3 relative z-10 scroll-smooth no-scrollbar">
                {uniqueMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={
                      msg.senderId !== userId
                        ? "p-2 rounded-lg w-fit"
                        : "p-2 rounded-lg w-fit ml-auto"
                    }
                    style={{
                      background:
                        msg.senderId !== userId
                          ? "var(--muted)"
                          : "var(--special)",
                      color:
                        msg.senderId !== userId
                          ? "var(--foreground)"
                          : "var(--background)",
                    }}
                  >
                    {msg.content}
                  </div>
                ))}

                {typingUser === activeChatId && (
                  <div
                    className="p-2 rounded-lg w-fit text-sm italic"
                    style={{ color: "var(--muted-foreground)" }}
                  >
                    {memoizedFriends.find((f) => f.id === activeChatId)?.name ||
                      "Friend"}{" "}
                    is typing...
                  </div>
                )}

                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <form
                className="p-4 bg-[var(--background)] flex gap-2 sticky bottom-0 z-20"
                style={{ borderTop: "1px solid var(--muted-foreground)" }}
                onSubmit={handleSubmit}
              >
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (activeChatId && e.target.value.trim()) {
                      sendTyping(activeChatId);
                    }
                  }}
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
