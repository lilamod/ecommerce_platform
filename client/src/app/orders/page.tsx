import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import OrderHistory from '../../components/OrderHistory';
import { authOptions } from '../api/auth/[...nextauth]/route';

export default async function Orders() {

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Order Tracking & History</h1>
      <OrderHistory />
    </div>
  );
}