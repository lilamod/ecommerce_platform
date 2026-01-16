"use client";

import { SessionProvider } from 'next-auth/react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Toaster } from 'react-hot-toast';  // Import for toast notifications
import Header from '../components/Header';
import '../styles/globals.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <Elements stripe={stripePromise}>
            <Header />
            {children}
          </Elements>
        </SessionProvider>
        <Toaster />  {/* Add this to enable global toast notifications */}
      </body>
    </html>
  );
}