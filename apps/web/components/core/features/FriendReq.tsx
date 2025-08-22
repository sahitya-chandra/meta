"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function FriendReq({ token }: { token?: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);

  const { data: session } = useSession();
  const selfId = session?.user?.id;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selfId) return;
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friend-requests/${selfId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setRequests(data);
    };
    fetchRequests();
  }, [selfId]);

  const handleSearch = async () => {
    if (!query) return;
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?email=${query}`
    );
    const data = await res.json();
    console.log(data);

    if (res.ok) {
      setSearchResult(data);
    } else {
      setSearchResult(null);
      alert(data.error);
    }
  };

  const handleSendRequest = async (friendId: string) => {
    const resp = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/friend-requests`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selfId, friendId }),
        credentials: "include",
      }
    );
    console.log({ selfId, friendId });
    alert("Friend request sent!");
    setSearchResult(null);
    setQuery("");
  };

  const handleAccept = async (id: string) => {
    console.log("Accepting friend request with ID:", id);
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/accept-friend-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: id }),
      }
    );
    console.log("Accepted friend request:", id);
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleReject = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reject-friend-request`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ requestId: id }),
      }
    );
    setRequests((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Go Home */}
      <div>
        <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded">
          Go to Home
        </Link>
      </div>

      {/* Search Section */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Search for Friends</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 bg-blue-500 text-white rounded"
          >
            Search
          </button>
        </div>

        {searchResult && (
          <div className="mt-2 p-3 border rounded flex justify-between items-center">
            <span>{searchResult.name || searchResult.email}</span>
            <button
              onClick={() => handleSendRequest(searchResult.id)}
              className="px-3 py-1 bg-green-500 text-white rounded"
            >
              Send Request
            </button>
          </div>
        )}
      </div>

      {/* Friend Requests Section */}
      <div>
        <h1 className="text-xl font-bold mb-4">Friend Requests</h1>
        {requests.length === 0 ? (
          <p>No pending requests</p>
        ) : (
          <ul className="space-y-2">
            {requests.map((req: any) => (
              <li
                key={req.id}
                className="flex justify-between items-center border p-3 rounded"
              >
                <span>
                  {req.requester?.name
                    ? `${req.requester.name} (${req.requester.email})`
                    : req.requester?.email || "Unknown User"}
                </span>

                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(req.id)}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(req.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
