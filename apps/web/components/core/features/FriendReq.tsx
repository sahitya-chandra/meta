"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Loader from "@/components/ui/loader";
import Nav from "@/components/ui/nav";
import { Requests, User } from "@/lib/types";

export default function FriendReq({ token }: { token: string | undefined }) {
  const [requests, setRequests] = useState<Requests[]>([]);
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("light");

  const { data: session } = useSession();
  const selfId = session?.user?.id;

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

  useEffect(() => {
    if(!token) return
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
  }, [selfId, token]);

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
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accept-friend-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId: id }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setLoading(false);
  };

  const handleReject = async (id: string) => {
    setLoading(true);
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reject-friend-request`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ requestId: id }),
    });
    setRequests((prev) => prev.filter((r) => r.id !== id));
    setLoading(false);
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <Nav toggleTheme={toggleTheme} theme={theme} />


      {/* Page Content */}
      <div className="p-6 mt-15 space-y-6">
        {/* Search */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Search for Friends</h2>
          <div className="flex gap-2">
            <input
              required
              type="text"
              placeholder="Enter email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border border-[var(--muted)] bg-[var(--background)] text-[var(--foreground)] p-2 rounded w-full"
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim() !== "") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={() => query.trim() && handleSearch()}
              disabled={query.trim() === ""}
              className={`px-3 py-2 rounded text-white ${
                query.trim() === ""
                  ? "bg-[var(--muted)] cursor-not-allowed"
                  : "bg-[var(--special)] hover:opacity-90"
              }`}
            >
              Search
            </button>
          </div>

          {searchResult && (
            <div className="mt-2 p-3 border border-[var(--muted)] rounded flex justify-between items-center">
              <span>{searchResult.name || searchResult.email}</span>
              <button
                onClick={() => handleSendRequest(searchResult.id)}
                className="px-3 py-1 bg-[var(--special)] text-white rounded"
              >
                Send Request
              </button>
            </div>
          )}
        </div>

        {/* Friend Requests */}
        <div>
          <h1 className="text-xl font-bold mb-4">Friend Requests</h1>
          {requests.length === 0 ? (
            <p className="text-[var(--muted-foreground)]">No pending requests</p>
          ) : (
            <ul className="space-y-2">
              {requests.map((req: Requests) => (
                <li
                  key={req.id}
                  className="flex justify-between items-center border border-[var(--muted)] p-3 rounded"
                >
                  <span>
                    {req.requester?.name
                      ? `${req.requester.name} (${req.requester.email})`
                      : req.requester?.email || "Unknown User"}
                  </span>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleAccept(req.id)}
                      className="px-3 py-1 rounded bg-[var(--special)] text-white"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(req.id)}
                      className="px-3 py-1 rounded border border-[var(--muted)] text-[var(--muted-foreground)]"
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
    </div>
  );
}
