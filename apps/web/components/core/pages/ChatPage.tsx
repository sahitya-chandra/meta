"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";

const ChatPage = ({ token }: { token: string }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [friends, setFriends] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [chatterId, setChattingId] = useState<string>("");

  const userId = session?.user?.id;

  const handleUser = (id: string) => {
    setChattingId(id);
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
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
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

  if (loading) return <Loader />;

  return (
    <div className="grid grid-cols-[350px_1fr] h-screen bg-gray-900 text-gray-200">
      <div className="flex flex-col bg-gray-800 border-r border-gray-700">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Friends
        </div>
        <div className="flex-1 overflow-y-auto">
          {friends.length === 0 ? (
            <p className="p-3 text-gray-400">No friends yet</p>
          ) : (
            friends.map((req: any) => (
              <li
                key={req.id}
                onClick={() => handleUser(req.id)}
                className={`p-3 cursor-pointer rounded transition ${
                  chatterId === req.id
                    ? "bg-amber-400 text-gray-900 font-semibold"
                    : "hover:bg-gray-700"
                }`}
              >
                {req.name}
              </li>
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col bg-gray-900">
        {chatterId === "" ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a friend to start chatting
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-700 font-semibold bg-gray-800">
              Chat with{" "}
              {friends.find((f) => f.id === chatterId)?.name || "Friend"}
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              <div className="bg-gray-700 p-2 rounded-lg w-fit">Hi there!</div>
              <div className="bg-green-600 p-2 rounded-lg w-fit ml-auto">
                Hello 👋
              </div>
            </div>
            <div className="p-4 border-t border-gray-700 flex gap-2 bg-gray-800">
              <input
                type="text"
                placeholder="Type a message"
                className="flex-1 bg-gray-700 text-gray-200 border border-gray-600 rounded-full px-4 py-2 focus:outline-none"
              />
              <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-full">
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
