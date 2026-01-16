"use client";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !productId) {
      setError('Missing required information. Please try again.');
      return;
    }

    setLoading(true);
    setError('');
    const cardElement = elements.getElement(CardElement)!;

    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (stripeError) {
      setError(stripeError.message || 'Payment method creation failed.');
      setLoading(false);
      return;
    }

    try {
      await axios.post('http://localhost:3001/payments', {
        paymentMethodId: paymentMethod!.id,
        productId,
      });
      router.push('/orders');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Complete Your Purchase</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="border p-3 rounded">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': { color: '#aab7c4' },
                },
                invalid: { color: '#9e2146' },
              },
            }}
          />
        </div>
        <button
          type="submit"
          disabled={!stripe || loading || !productId}
          className={`w-full py-2 px-4 rounded text-white font-medium ${
            loading || !stripe || !productId
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          aria-label="Pay now"
        >
          {loading ? 'Processing...' : 'Pay'}
        </button>
      </form>
    </div>
  );
}