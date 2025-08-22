"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"

export default function FriendList({ token }: { token: any }) {
  const [friends, setFriends] = useState<any[]>([])
  const { data: session } = useSession()
  const selfId = session?.user?.id

  useEffect(() => {
    if (!selfId) return

    const fetchFriends = () => {
      try {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friends`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }).then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log(data);
          console.log("Fetched friends:", data)
          setFriends(data)
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
      } catch (err) {
        console.error("Error fetching friends:", err)
      }
    }

    fetchFriends()
  }, [selfId])

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
  )
}
