'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteSubscriberButton({ id, email }: { id: number; email: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Obrisati pretplatnika "${email}"?`)) return;
    const res = await fetch(`/api/newsletter/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      alert('Greška pri brisanju pretplatnika');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
      title="Obriši pretplatnika"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
