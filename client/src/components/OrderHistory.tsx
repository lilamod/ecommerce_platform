"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Order } from '../types';

export default function OrderHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Replace with real API call: const res = await axios.get('http://localhost:3001/orders');
        // For now, using mock data
        setOrders([
          { id: 1, productName: 'Product 1', status: 'Shipped', date: '2023-01-01' },
        ]);
      } catch (err: any) {
        setError('Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border p-4 rounded">
            <p><strong>Product:</strong> {order.productName}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {order.date}</p>
          </div>
        ))
      )}
    </div>
  );
}