// app/auth/signup/page.tsx
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface SignUpForm {
  email: string;
  password: string;
  name: string;
}

export default function SignUp() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpForm>();

  const onSubmit = async (data: SignUpForm) => {
    setLoading(true);
    try {
      console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, data);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signup`, data);
      toast.success('Check your email for verification!');
      setTimeout(() => {
        router.push('/auth/verify-email');  // Redirect to the new verification page
      }, 2000);
    } catch (error: any) {
      console.error('Signup error:', error);  // Log for debugging
      if (error.response) {
        toast.error(error.response.data?.message || 'Error signing up. Please try again.');
      } else if (error.request) {
        toast.error('Network error. Please check your connection and try again.');
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">Create Account</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register('name', { required: 'Name is required' })}
            type="text"
            placeholder="Name"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Name"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          <input
            {...register('email', { required: 'Email is required' })}
            type="email"
            placeholder="Email"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Email"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            type="password"
            placeholder="Password"
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Password"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-3 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{' '}
          <Link href="/auth/signin" className="text-indigo-600 font-medium hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}