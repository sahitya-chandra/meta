"use client"
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session } = useSession();
  const [friends, setFriends] = useState<any[]>([]);
  const userId = session?.user.id;
  const [chats, setChats] = useState<any[]>([]);
  const [chatterId, setChattingId] = useState<string>("");

  const handleuser = (id: string) => {
    setChattingId(id);
    console.log("Selected friend id:", id);
  };

  useEffect(() => {
    if (!userId) return;
    const fetchFriends = async () => {
      try {
        const res = await fetch(`http://localhost:4000/api/friends/${userId}`);
        const data = await res.json();
        console.log("Fetched friends:", data);
        setFriends(data || []);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [userId]);

  return (
    <div className="grid grid-cols-[350px_1fr] h-screen bg-gray-900 text-gray-200">
      {/* Sidebar (Friends List) */}
      <div className="flex flex-col bg-gray-800 border-r border-gray-700">
        <div className="p-4 font-bold text-lg border-b border-gray-700">
          Friends
        </div>

        <div className="flex-1 overflow-y-auto">
          {friends.length === 0 ? (
            <>
              <div className="p-3 hover:bg-gray-700 cursor-pointer rounded">
                Alice
              </div>
              <div className="p-3 hover:bg-gray-700 cursor-pointer rounded">
                Bob
              </div>
              <div className="p-3 hover:bg-gray-700 cursor-pointer rounded">
                Charlie
              </div>
            </>
          ) : (
            friends.map((req: any) => (
  <li
    key={req.id}
    onClick={() => handleuser(req.id)}
    className={`p-3 cursor-pointer rounded transition active:bg-white
      ${chatterId === req.id 
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

      {/* Chat Window */}
      <div className="flex flex-col bg-gray-900">
        {chatterId === "" ? (
          // No friend selected
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a friend to start chatting
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 font-semibold bg-gray-800">
              Chat with {friends.find((f) => f.id === chatterId)?.name || "Friend"}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-2">
              <div className="bg-gray-700 p-2 rounded-lg w-fit">Hi there!</div>
              <div className="bg-green-600 p-2 rounded-lg w-fit ml-auto">
                Hello 👋
              </div>
            </div>

            {/* Message Input */}
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

export default Page;
