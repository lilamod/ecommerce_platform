"use client";  // Must be at the top for client component

import { useRouter } from 'next/navigation';  // For redirect after sign-out
import axios from 'axios';  // For API call
import toast from 'react-hot-toast';

export default function SignOutButton() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // Optional: Call your backend to invalidate the token
      const token = localStorage.getItem('authToken');
      if (token) {
        await axios.post(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signout`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          }
        );
      }
    } catch (error) {
      console.error('Sign-out API error:', error);  // Log but don't block sign-out
    }

    // Clear client-side storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Show success and redirect
    toast.success('Signed out successfully!');
    router.push('/auth/signin');  // Redirect to sign-in page
  };

  return (
    <button
      onClick={handleSignOut}  // Event handler is handled internally in the client component
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
    >
      Sign Out
    </button>
  );
}