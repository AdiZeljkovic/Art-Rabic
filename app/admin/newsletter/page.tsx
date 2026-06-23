import { prisma } from '@/lib/prisma';
import DeleteSubscriberButton from './DeleteSubscriberButton';

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: 'desc' },
  });

  const activeCount = subscribers.filter(s => s.isActive).length;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-graphite">Newsletter pretplatnici</h1>
        <p className="text-gray-500 mt-1">{activeCount} aktivnih pretplatnika od ukupno {subscribers.length}</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum prijave</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {subscribers.map((sub, i) => (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-400">{i + 1}</td>
                  <td className="px-6 py-3 text-graphite font-medium">{sub.email}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${sub.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {sub.isActive ? 'Aktivan' : 'Neaktivan'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500">{sub.subscribedAt.toLocaleDateString('bs')}</td>
                  <td className="px-6 py-3">
                    <DeleteSubscriberButton id={sub.id} email={sub.email} />
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-400">Nema pretplatnika</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
