'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteMessageButton({ id }: { id: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Sigurno želiš obrisati ovu poruku?')) return;
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Greška pri brisanju poruke');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
      title="Obriši poruku"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
