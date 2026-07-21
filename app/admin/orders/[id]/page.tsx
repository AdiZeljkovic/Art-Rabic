import { prisma } from '@/lib/prisma';
import { formatPrice, toId } from '@/lib/format';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import OrderStatusForm from './OrderStatusForm';

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderId = toId(id);
  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { book: { include: { category: true } } },
  });
  if (!order) notFound();

  const statusLabels: Record<string, string> = {
    PENDING: 'Na čekanju',
    CONFIRMED: 'Potvrđena',
    SHIPPED: 'Poslana',
    DELIVERED: 'Isporučena',
    CANCELLED: 'Otkazana',
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <Link href="/admin/orders" className="flex items-center gap-2 text-sm text-gray-500 hover:text-graphite mb-4">
          <ArrowLeft className="w-4 h-4" /> Nazad na narudžbe
        </Link>
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-semibold text-graphite">Narudžba #{order.id}</h1>
          <span className="text-sm text-gray-500">{order.createdAt.toLocaleDateString('bs')}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-graphite mb-4">Podaci kupca</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex gap-2"><dt className="text-gray-500 w-24 flex-shrink-0">Ime:</dt><dd className="text-graphite font-medium">{order.firstName} {order.lastName}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-24 flex-shrink-0">Email:</dt><dd className="text-graphite">{order.email}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-24 flex-shrink-0">Telefon:</dt><dd className="text-graphite">{order.phone}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-24 flex-shrink-0">Adresa:</dt><dd className="text-graphite">{order.address}</dd></div>
            <div className="flex gap-2"><dt className="text-gray-500 w-24 flex-shrink-0">Grad:</dt><dd className="text-graphite">{order.city}, {order.zip}</dd></div>
          </dl>
        </div>

        {/* Book Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h2 className="font-semibold text-graphite mb-4">Naručena knjiga</h2>
          <p className="font-medium text-graphite mb-1">{order.book.title}</p>
          <p className="text-sm text-gray-500 mb-4">{order.book.author}</p>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-gray-500">Cijena knjige:</dt><dd className="text-graphite">{formatPrice(order.bookPrice)}</dd></div>
            <div className="flex justify-between"><dt className="text-gray-500">Dostava:</dt><dd className="text-graphite">{formatPrice(order.deliveryFee)}</dd></div>
            <div className="flex justify-between font-semibold text-base pt-2 border-t border-gray-100"><dt className="text-graphite">Ukupno:</dt><dd className="text-brand-red">{formatPrice(order.totalPrice)}</dd></div>
          </dl>
        </div>

        {/* Status Update */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 md:col-span-2">
          <h2 className="font-semibold text-graphite mb-4">Status narudžbe</h2>
          <OrderStatusForm orderId={order.id} currentStatus={order.status} statusLabels={statusLabels} />
        </div>
      </div>
    </div>
  );
}
