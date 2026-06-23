import { prisma } from '@/lib/prisma';
import { BookOpen, ShoppingBag, MessageSquare, Mail } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';

export default async function AdminDashboard() {
  const [bookCount, pendingOrders, unreadMessages, subscriberCount, recentOrders] = await Promise.all([
    prisma.book.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.contactMessage.count({ where: { isRead: false } }),
    prisma.newsletterSubscriber.count({ where: { isActive: true } }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { book: true },
    }),
  ]);

  const stats = [
    { label: 'Ukupno knjiga', value: bookCount, icon: BookOpen, href: '/admin/books', color: 'bg-blue-50 text-blue-600' },
    { label: 'Nove narudžbe', value: pendingOrders, icon: ShoppingBag, href: '/admin/orders?status=PENDING', color: 'bg-amber-50 text-amber-600' },
    { label: 'Nepročitane poruke', value: unreadMessages, icon: MessageSquare, href: '/admin/messages', color: 'bg-red-50 text-red-600' },
    { label: 'Newsletter pretplatnici', value: subscriberCount, icon: Mail, href: '/admin/newsletter', color: 'bg-green-50 text-green-600' },
  ];

  const statusLabels: Record<string, { label: string; cls: string }> = {
    PENDING: { label: 'Na čekanju', cls: 'bg-amber-100 text-amber-800' },
    CONFIRMED: { label: 'Potvrđena', cls: 'bg-blue-100 text-blue-800' },
    SHIPPED: { label: 'Poslana', cls: 'bg-orange-100 text-orange-800' },
    DELIVERED: { label: 'Isporučena', cls: 'bg-green-100 text-green-800' },
    CANCELLED: { label: 'Otkazana', cls: 'bg-red-100 text-red-800' },
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-graphite mb-8">Kontrolna ploča</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {stats.map(({ label, value, icon: Icon, href, color }) => (
          <Link key={label} href={href} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 font-medium">{label}</span>
              <div className={`p-2 rounded-lg ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-bold text-graphite">{value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-graphite">Posljednje narudžbe</h2>
          <Link href="/admin/orders" className="text-sm text-brand-red hover:underline">Sve narudžbe</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kupac</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Knjiga</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ukupno</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map(order => {
                const st = statusLabels[order.status] ?? { label: order.status, cls: 'bg-gray-100 text-gray-800' };
                return (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500">#{order.id}</td>
                    <td className="px-6 py-4 text-graphite font-medium">{order.firstName} {order.lastName}</td>
                    <td className="px-6 py-4 text-gray-600">{order.book.title}</td>
                    <td className="px-6 py-4 text-graphite font-medium">{formatPrice(order.totalPrice)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{order.createdAt.toLocaleDateString('bs')}</td>
                  </tr>
                );
              })}
              {recentOrders.length === 0 && (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-gray-400">Nema narudžbi</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
