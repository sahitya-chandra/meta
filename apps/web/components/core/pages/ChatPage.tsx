'use client'

import React, { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Nav from "@/components/ui/nav";
import { Message, useChat } from "@/hooks/useChat";

const ChatPage = ({ token }: { token: any }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string>("");
  const [theme, setTheme] = useState("light");
  const [message, setMessage] = useState("");
  const userId: string = session?.user?.id as string;
  const [allChats, setAllChats] = useState<Message[]>([]);
  const { messages, typingUser, sendMessage, sendTyping, onlineUsers } = useChat(userId, token);

  // Handle friend click
  const handleSelectFriend = (id: string) => {
    setActiveChatId(id);
    setAllChats([]);
  };

  useEffect(() => {
    if (!activeChatId || !token) return;

    const fetchMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/messages?friendId=${activeChatId}&since=${new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        console.log("Fetched messages:", data);
        // Only set messages that aren't already in the WebSocket messages
        setAllChats(data.filter((msg: Message) => !messages.some((m) => m.id === msg.id)));
      } catch (err) {
        console.error("Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [activeChatId, token]);

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
        console.log("Fetched friends:", data)
        setFriends(data || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId, token]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!message.trim()) return;
    console.log("Sending message:", message)
    sendMessage(activeChatId, message)
    setMessage("");
  }

  const uniqueMessages = useMemo(
    () =>
      [...allChats, ...messages]
        .filter(
          (msg, index, self) =>
            index === self.findIndex((m) => m.id === msg.id)
        )
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [allChats, messages]
  );

  const memoizedFriends = useMemo(
    () =>
      friends.map((friend) => ({
        ...friend,
        isOnline: onlineUsers.includes(friend.id),
      })),
    [friends, onlineUsers]
  );

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
                      backgroundColor: onlineUsers.includes(friend.id)
                        ? "#22c55e" // Green
                        : "#ef4444", // Red
                    }}
                  />
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
                {memoizedFriends.find((f) => f.id === activeChatId)?.name || "Friend"}
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
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
                    {memoizedFriends.find((f) => f.id === activeChatId)?.name || "Friend"} is typing...
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <form
                className="p-4 flex gap-2"
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