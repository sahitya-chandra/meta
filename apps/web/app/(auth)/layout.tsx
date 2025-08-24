'use client';

import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      {/* Content */}
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl shadow-lg bg-[var(--background)] border border-[var(--muted)] p-6 md:p-8">
          {children}
        </div>
      </main>

      {/* Bottom Bar */}
      <footer className="h-12 flex items-center justify-center border-t border-[var(--muted)] text-xs">
        &copy; {new Date().getFullYear()} MyApp
      </footer>
    </div>
  );
};

export default AuthLayout;
