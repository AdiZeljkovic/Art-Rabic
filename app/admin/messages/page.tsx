import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DeleteMessageButton from './DeleteMessageButton';

const subjectLabels: Record<string, string> = {
  izdavastvo: 'Izdavaštvo',
  prodaja: 'Prodaja/Distribucija',
  mediji: 'Mediji',
  ostalo: 'Ostalo',
};

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: 'desc' },
  });

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-graphite">Poruke</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">{unreadCount} nepročitanih</p>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg divide-y divide-gray-100">
        {messages.map(msg => (
          <div key={msg.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${msg.isRead ? 'bg-gray-300' : 'bg-brand-red'}`} />
            <Link href={`/admin/messages/${msg.id}`} className="flex-1 min-w-0 block">
              <div className="flex items-center gap-3 mb-1">
                <span className={`font-medium text-sm ${msg.isRead ? 'text-gray-600' : 'text-graphite'}`}>
                  {msg.name}
                </span>
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                  {subjectLabels[msg.subject] || msg.subject}
                </span>
                {!msg.isRead && (
                  <span className="text-xs px-2 py-0.5 bg-brand-red text-white rounded">Novo</span>
                )}
              </div>
              <p className="text-sm text-gray-500 truncate">{msg.email}</p>
              <p className="text-sm text-gray-500 truncate mt-0.5">{msg.message}</p>
            </Link>
            <div className="flex items-center gap-3 flex-shrink-0">
              <span className="text-xs text-gray-400">{msg.createdAt.toLocaleDateString('bs')}</span>
              <DeleteMessageButton id={msg.id} />
            </div>
          </div>
        ))}
        {messages.length === 0 && (
          <div className="px-6 py-12 text-center text-gray-400">Nema poruka</div>
        )}
      </div>
    </div>
  );
}
