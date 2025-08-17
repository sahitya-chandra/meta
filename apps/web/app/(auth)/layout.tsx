// AuthLayout.tsx or AuthLayout.jsx
'use client'; // This component needs to be a Client Component to use `useRouter` or `usePathname`

import React from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation for App Router

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // Initialize the Next.js router

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 relative">
      <div
        className="h-16 flex flex-col items-center justify-center bg-black text-white font-bold text-lg group cursor-pointer" // Added cursor-pointer for better UX
        onClick={() => {
          router.push("/"); // Use router.push() for navigation in Next.js
        }}
      >
        <span className="group-hover:scale-x-170 group-hover:scale-y-150 group-hover:-translate-z-30 transition duration-1000">META</span>
        <div className="mt-1 h-0.5 w-20 bg-white scale-x-0 transform origin-left transition-transform duration-500 ease-in-out group-hover:scale-x-100"></div>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          {children}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 dark:text-gray-400 py-4">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </div>
    </div>
  );
};

export default AuthLayout;