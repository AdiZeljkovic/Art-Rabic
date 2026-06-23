import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';

type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

const statusLabels: Record<OrderStatus, { label: string; cls: string }> = {
  PENDING: { label: 'Na čekanju', cls: 'bg-amber-100 text-amber-800' },
  CONFIRMED: { label: 'Potvrđena', cls: 'bg-blue-100 text-blue-800' },
  SHIPPED: { label: 'Poslana', cls: 'bg-orange-100 text-orange-800' },
  DELIVERED: { label: 'Isporučena', cls: 'bg-green-100 text-green-800' },
  CANCELLED: { label: 'Otkazana', cls: 'bg-red-100 text-red-800' },
};

const tabs = [
  { label: 'Sve', value: null },
  { label: 'Na čekanju', value: 'PENDING' },
  { label: 'Potvrđene', value: 'CONFIRMED' },
  { label: 'Poslane', value: 'SHIPPED' },
  { label: 'Isporučene', value: 'DELIVERED' },
  { label: 'Otkazane', value: 'CANCELLED' },
];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const activeStatus = (status as OrderStatus) || null;

  const orders = await prisma.order.findMany({
    where: activeStatus ? { status: activeStatus } : undefined,
    include: { book: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-graphite mb-6">Narudžbe</h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const isActive = tab.value === activeStatus;
          return (
            <Link
              key={tab.label}
              href={tab.value ? `/admin/orders?status=${tab.value}` : '/admin/orders'}
              className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors rounded ${isActive ? 'bg-graphite text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kupac</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Knjiga</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ukupno</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Detalji</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => {
                const st = statusLabels[order.status];
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-graphite">{order.firstName} {order.lastName}</p>
                      <p className="text-xs text-gray-500">{order.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate">{order.book.title}</td>
                    <td className="px-4 py-3 font-medium text-graphite">{formatPrice(order.totalPrice)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{order.createdAt.toLocaleDateString('bs')}</td>
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${order.id}`} className="text-xs text-brand-red hover:underline">Pregledaj</Link>
                    </td>
                  </tr>
                );
              })}
              {orders.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">Nema narudžbi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
