"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Loader from "@/components/ui/loader";

export default function FriendReq({ token }: { token?: any }) {
  const [requests, setRequests] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const selfId = session?.user?.id;

  useEffect(() => {
    const fetchRequests = async () => {
      if (!selfId) return;
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/friend-requests/${selfId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await res.json();
      setRequests(data);
      setLoading(false);
    };
    fetchRequests();
  }, [selfId]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users?email=${query}`
    );
    const data = await res.json();
    if (res.ok) {
      setSearchResult(data);
    } else {
      setSearchResult(null);
      alert(data.error);
    }
    setLoading(false);
  };

  const handleSendRequest = async (friendId: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/friend-requests`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selfId, friendId }),
      credentials: "include",
    });
    setSearchResult(null);
    setQuery("");
    setLoading(false);
  };

  const handleAccept = async (id: string) => {
    setLoading(true);
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
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
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
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <Link href="/" className="px-4 py-2 bg-gray-800 text-white rounded">
          Go to Home
        </Link>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Search for Friends</h2>
        <div className="flex gap-2">
          <input
            required
            type="text"
            placeholder="Enter email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border p-2 rounded w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter" && query.trim() !== "") {
                handleSearch();
              }
            }}
          />
          <button
            onClick={() => {
              if (query.trim() !== "") {
                handleSearch();
              }
            }}
            disabled={query.trim() === ""}
            className={`px-3 py-2 rounded text-white ${
              query.trim() === ""
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
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
