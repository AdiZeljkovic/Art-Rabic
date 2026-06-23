'use client';

import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DeleteBookButton({ bookId, bookTitle }: { bookId: number; bookTitle: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm(`Sigurno želiš obrisati "${bookTitle}"?`)) return;
    const res = await fetch(`/api/books/${bookId}`, { method: 'DELETE' });
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error || 'Greška pri brisanju');
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
      title="Obriši"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
