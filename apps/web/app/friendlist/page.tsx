"use client";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const FriendListPage = () => {
  const [friends, setFriends] = useState<any[]>([]);
  const { data: session } = useSession();
  const selfId = session?.user.id;
  // console.log("Session data:", session);
  // console.log("Self ID:", selfId);

  useEffect(() => {
    if (!selfId) return;
    const fetchFriends = async () => {
      try {
        //console.log("Fetching friends for selfId:", selfId);
        const res = await fetch(`http://localhost:4000/api/friends/${selfId}`);
        const data = await res.json();
        console.log("Fetched friends:", data);
        setFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      }
    };
    fetchFriends();
  }, [selfId]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Friends</h1>
      {friends.length === 0 ? (
        <p>No friends yet</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend: any) => (
            <li
              key={friend.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>
                {friend.name
                  ? `${friend.name} (${friend.email})`
                  : friend.email}
              </span>
              <button className="px-3 py-1 bg-blue-500 text-white rounded">
                <a href="/chatpage">Chat</a>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendListPage;
