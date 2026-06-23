'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OrderStatusForm({
  orderId,
  currentStatus,
  statusLabels,
}: {
  orderId: number;
  currentStatus: string;
  statusLabels: Record<string, string>;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleUpdate = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error();
      setMessage('Status uspješno ažuriran!');
      router.refresh();
    } catch {
      setMessage('Greška pri ažuriranju.');
    } finally {
      setLoading(false);
    }
  };

  const statusColors: Record<string, string> = {
    PENDING: 'bg-amber-100 text-amber-800',
    CONFIRMED: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-orange-100 text-orange-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  };

  return (
    <div className="flex items-center gap-4">
      <span className={`inline-block text-sm font-medium px-3 py-1.5 rounded-full ${statusColors[currentStatus]}`}>
        Trenutno: {statusLabels[currentStatus]}
      </span>
      <select
        value={status}
        onChange={e => setStatus(e.target.value)}
        className="px-3 py-2 border border-gray-300 focus:border-brand-red focus:outline-none text-sm text-graphite bg-white"
      >
        {Object.entries(statusLabels).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus}
        className="px-4 py-2 bg-graphite text-white text-sm font-medium hover:bg-brand-red transition-colors disabled:opacity-50"
      >
        {loading ? 'Ažuriranje...' : 'Ažuriraj'}
      </button>
      {message && <span className="text-sm text-green-600">{message}</span>}
    </div>
  );
}
