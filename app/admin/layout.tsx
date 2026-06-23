import { headers } from 'next/headers';
import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Admin | Art Rabic' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLoginPage = pathname === '/admin/login';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isLoginPage && <AdminSidebar />}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
