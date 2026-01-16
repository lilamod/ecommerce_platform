"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasVerifiedRef = useRef(false);

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);

  // Optimized: Use useCallback to memoize the function and prevent re-creation
  const verifyEmail = useCallback(async (token: string) => {
    console.log("Starting verification request for token:", token); // Debug log
    try {
      const result = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {
          params: { token },
          timeout: 5000, // Add timeout to prevent hanging (5 seconds)
        }
      );

      console.log("Verification success:", result.data); // Debug log
      setVerified(true);
      toast.success("Email verified successfully!");

      setTimeout(() => {
        router.replace("/auth/signin");
      }, 1500);
    } catch (error: any) {
    
      const errorMessage =
        error.response?.data?.message ||
        (error.code === "ECONNABORTED" ? "Request timed out. Please try again." : "Verification failed. The link may be invalid or expired.");
      
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Ensure loading stops regardless of outcome
    }
  }, [router]); // Dependencies: router (for redirect)

  useEffect(() => {
    if (!searchParams || hasVerifiedRef.current) return;

    const token = searchParams.get("token");
    console.log("Token from URL:", token); // Debug log

    if (!token || token.trim() === "") {
      setLoading(false);
      toast.error("Invalid or missing verification token.");
      return;
    }

    hasVerifiedRef.current = true;
    verifyEmail(token);
  }, [searchParams, verifyEmail]); // Include verifyEmail in deps for useCallback

  // Loading state with subtle animation
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center animate-pulse">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Verifying your email…
          </h1>
          <p className="text-gray-600">Please wait a moment.</p>
          <div className="mt-4 w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  // Success state
  if (verified) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-semibold mb-4 text-gray-800">
            Email Verified 🎉
          </h1>
          <p className="text-gray-600 mb-6">
            Your account is now active. Redirecting…
          </p>
          <Link
            href="/auth/signin"
            className="text-indigo-600 font-medium hover:underline"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    );
  }

  // Error/fallback state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold mb-4 text-gray-800">
          Invalid Verification Link
        </h1>
        <p className="text-gray-600 mb-6">
          The verification link is missing or invalid. Please check your email or try again.
        </p>
        <Link
          href="/auth/signin"
          className="text-indigo-600 font-medium hover:underline"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}