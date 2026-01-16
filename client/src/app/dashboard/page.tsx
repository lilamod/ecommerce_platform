"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SignOutButton from "../../components/signout";

type User = {
  email: string;
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Invalid user in localStorage");
        setUser(null);
      }
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back 👋
          </h1>
          <p className="text-gray-500 mt-1">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Link
            href="/products"
            className="border rounded-lg p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">Products</h2>
            <p className="text-gray-500 mt-2">
              Browse and manage products
            </p>
          </Link>

          <Link
            href="/orders"
            className="border rounded-lg p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold">Orders</h2>
            <p className="text-gray-500 mt-2">
              View your order history
            </p>
          </Link>
        </div>

        <div className="flex justify-end border-t pt-6">
          <SignOutButton />
        </div>
      </div>
    </div>
  );
}
