"use client";

import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams?.get('productId');
  const [loading, setLoading] = useState(false);
  const { handleSubmit } = useForm();

  const onSubmit = async () => {
    if (!stripe || !elements || !productId) return;
    setLoading(true);
    const cardElement = elements.getElement(CardElement)!;
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });
    if (error) {
      toast.error(error.message || 'Payment error');
      setLoading(false);
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/payments`, {
        paymentMethodId: paymentMethod.id,
        productId,
      });
      toast.success('Payment successful!');
      router.push('/orders');
    } catch {
      toast.error('Payment failed. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-4">
      <CardElement className="p-2 border rounded" />
      <button
        type="submit"
        disabled={!stripe || loading || !productId}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay'}
      </button>
    </form>
  );
}