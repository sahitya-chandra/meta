"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";

export default function FriendList({ token }: { token: any }) {
  const [friends, setFriends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const selfId = session?.user?.id;

  useEffect(() => {
    if (!selfId) return;
    const fetchFriends = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setFriends(data);
      } catch (err) {
        console.error("Error fetching friends:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFriends();
  }, [selfId, token]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Friends</h1>
      {loading ? (
        <Loader />
      ) : friends.length === 0 ? (
        <p>No friends yet</p>
      ) : (
        <ul className="space-y-2">
          {friends.map((friend: any) => (
            <li
              key={friend.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>
                {friend.name ? `${friend.name} (${friend.email})` : friend.email}
              </span>
              <a
                href="/chatpage"
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Chat
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
