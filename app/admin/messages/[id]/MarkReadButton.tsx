'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function MarkReadButton({ messageId, isRead }: { messageId: number; isRead: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(isRead);

  const handleMarkRead = async () => {
    if (done) return;
    setLoading(true);
    await fetch(`/api/contact/${messageId}`, { method: 'PATCH' });
    setDone(true);
    setLoading(false);
    router.refresh();
  };

  return (
    <button
      onClick={handleMarkRead}
      disabled={done || loading}
      className="px-4 py-2 bg-graphite text-white text-sm font-medium hover:bg-brand-red transition-colors disabled:opacity-50"
    >
      {done ? 'Označeno kao pročitano' : loading ? 'Označavanje...' : 'Označi kao pročitano'}
    </button>
  );
}
