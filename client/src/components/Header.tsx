"use client";

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link href="/" className="text-xl font-bold">App Name</Link>
      <nav className="flex gap-4">
        {session ? (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <button
              onClick={() => signOut()}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
              aria-label="Sign out"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/auth/signin" className="hover:underline">Sign In</Link>
        )}
      </nav>
    </header>
  );
}