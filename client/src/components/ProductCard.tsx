"use client";

import React, { useState } from "react";
import { useRouter } from 'next/navigation';

interface Product {
  _id: string;
  name: string;
  price: string;
  description: string;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ProductCard({ product, onEdit, onDelete }: ProductCardProps) {
  const router = useRouter();
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo(prev => ({ ...prev, [name]: value }));
  };

  const handlePurchase = () => {
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Here you would integrate with a payment processor like Stripe
    // For example, using Stripe Elements or a backend API
    // This is a placeholder - in a real app, handle payment securely
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Order placed successfully!');
      setShowCheckout(false);
      // Optionally, redirect to a confirmation page
      router.push('/orders');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
      {product.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/uploads/product/${product.image}`}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mb-2">{product.price}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <div className="flex justify-between mb-4">
          <button
            onClick={onEdit}
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Delete
          </button>
        </div>
        <button
          onClick={handlePurchase}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          aria-label={`Buy ${product.name}`}
        >
          Buy Now
        </button>
        {showCheckout && (
          <div className="mt-4 p-4 border rounded bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">Payment Details</h4>
            <div className="space-y-2">
              <input
                type="text"
                name="nameOnCard"
                placeholder="Name on Card"
                value={paymentInfo.nameOnCard}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="cardNumber"
                placeholder="Card Number"
                value={paymentInfo.cardNumber}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="expiryDate"
                  placeholder="MM/YY"
                  value={paymentInfo.expiryDate}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded"
                />
                <input
                  type="text"
                  name="cvv"
                  placeholder="CVV"
                  value={paymentInfo.cvv}
                  onChange={handleInputChange}
                  className="flex-1 p-2 border rounded"
                />
              </div>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}