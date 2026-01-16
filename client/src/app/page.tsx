import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-500 to-indigo-600 p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Full Stack Ecommerce App</h1>
        <p className="text-gray-600 mb-8">Get started by signing in or creating an account.</p>
        <div className="flex flex-col gap-4">
          <Link
            href="/auth/signin"
            className="bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-medium hover:bg-gray-200 transition-colors border"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}