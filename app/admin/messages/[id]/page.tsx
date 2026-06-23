import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import MarkReadButton from './MarkReadButton';

const subjectLabels: Record<string, string> = {
  izdavastvo: 'Prijedlog za izdavanje',
  prodaja: 'Pitanje o prodaji/distribuciji',
  mediji: 'Upit za medije',
  ostalo: 'Ostalo / Opšti upit',
};

export default async function AdminMessageDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const msg = await prisma.contactMessage.findUnique({ where: { id: parseInt(id) } });
  if (!msg) notFound();

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <Link href="/admin/messages" className="flex items-center gap-2 text-sm text-gray-500 hover:text-graphite mb-4">
          <ArrowLeft className="w-4 h-4" /> Nazad na poruke
        </Link>
        <h1 className="text-2xl font-semibold text-graphite">Poruka od {msg.name}</h1>
        <p className="text-sm text-gray-500 mt-1">{msg.createdAt.toLocaleDateString('bs')} u {msg.createdAt.toLocaleTimeString('bs', { hour: '2-digit', minute: '2-digit' })}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Ime i prezime</dt>
            <dd className="text-graphite font-medium">{msg.name}</dd>
          </div>
          <div>
            <dt className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Email</dt>
            <dd><a href={`mailto:${msg.email}`} className="text-brand-red hover:underline">{msg.email}</a></dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Predmet</dt>
            <dd className="text-graphite">{subjectLabels[msg.subject] || msg.subject}</dd>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <dt className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-3">Poruka</dt>
          <dd className="text-graphite leading-relaxed whitespace-pre-wrap">{msg.message}</dd>
        </div>

        <div className="border-t border-gray-100 pt-4 flex items-center gap-4">
          <MarkReadButton messageId={msg.id} isRead={msg.isRead} />
          <a
            href={`mailto:${msg.email}?subject=Re: ${subjectLabels[msg.subject] || msg.subject}`}
            className="px-4 py-2 border border-graphite text-graphite text-sm font-medium hover:bg-graphite hover:text-white transition-colors"
          >
            Odgovori emailom
          </a>
        </div>
      </div>
    </div>
  );
}
