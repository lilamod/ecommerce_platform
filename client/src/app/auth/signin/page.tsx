"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import axios from 'axios';
import toast from 'react-hot-toast';

interface SignInForm {
  email: string;
  password: string;
}

export default function SignIn() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<SignInForm>();

  const onSubmit = async (data: SignInForm) => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/signin`,
        data,
        { timeout: 5000 }
      );
      const { userDetail } = res.data;

      // Store token in localStorage (or use a context/state for better management)
      localStorage.setItem('authToken', userDetail.token);
      localStorage.setItem('user', JSON.stringify({
        id: userDetail.userId,
        name: userDetail.name,
        email: data.email,
      }));

      toast.success('Signed in successfully!');
      router.push('/dashboard'); 
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-center mb-6">Sign In</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+$/, message: 'Invalid email format' },
            })}
            type="email"
            placeholder="Email"
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Email"
            disabled={loading}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          <input
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
            type="password"
            placeholder="Password"
            className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Password"
            disabled={loading}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-3 rounded-lg text-white font-medium transition-colors ${
              loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link href="/auth/signup" className="text-indigo-600 font-medium hover:underline">
            Sign Up
          </Link>
        </p>
        {/* Optional: Add social login buttons here if using NextAuth or API */}
      </div>
    </div>
  );
}