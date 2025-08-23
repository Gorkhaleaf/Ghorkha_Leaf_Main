"use client";

import { useState, useEffect } from "react";
import { createClient } from '@/lib/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

interface Order {
  id: string;
  created_at: string;
  items: any[];
  amount: number;
  currency: string;
  status: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        console.log('[Orders] - calling supabase.auth.getSession()');
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('[Orders] - getSession result', {
          session: session ? { user: { id: session.user.id }, expires_at: session.expires_at } : null,
          error
        });

        if (!session) {
          console.warn('[Orders] - no session found, skipping fetch');
          setOrders([]);
          setLoading(false);
          return;
        }

        const accessToken = (session as any).access_token || (session as any).accessToken || null;
        const maskedToken = accessToken ? `${String(accessToken).slice(0,10)}...` : null;
        console.log('[Orders] - session user id:', session.user.id, 'accessToken(masked):', maskedToken);

        const headers: Record<string,string> = {
          'Content-Type': 'application/json',
        };
        if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

        const requestInit: RequestInit = {
          method: 'GET',
          headers,
          credentials: 'include'
        };

        console.log('[Orders] - fetching /api/orders with', {
          method: requestInit.method,
          headers: { ...requestInit.headers, Authorization: maskedToken ? `Bearer ${maskedToken}` : undefined },
          credentials: requestInit.credentials
        });

        const response = await fetch('/api/orders', requestInit);
        console.log('[Orders] - response.status', response.status);
        const text = await response.text();

        let data;
        try {
          data = text ? JSON.parse(text) : null;
        } catch (parseErr) {
          console.error('[Orders] - failed to parse response body', parseErr, 'body:', text);
        }

        if (response.ok) {
          console.log('[Orders] - successful response body:', data);
          setOrders(Array.isArray(data) ? data : []);
        } else {
          console.error('[Orders] - fetch returned non-OK', response.status, data);
          setOrders([]);
        }
      } catch (error) {
        console.error('[Orders] - Failed to fetch orders:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Loading orders...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
          <Link href="/products" className="text-blue-600 hover:underline">
            Browse products
          </Link>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id.substring(0, 8)}...</TableCell>
                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                <TableCell>{order.items.length} items</TableCell>
                <TableCell>{order.amount} {order.currency}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'success' ? 'bg-green-100 text-green-800' : 
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}