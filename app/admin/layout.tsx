import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyAdminToken } from '@/lib/auth';
import AdminSidebar from './AdminSidebar';

export const metadata = { title: 'Admin | Art Rabic' };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname = headersList.get('x-pathname') || '';
  const isLoginPage = pathname === '/admin/login';

  // Drugi sloj zaštite. Middleware je prvi, ali sve admin stranice čitaju
  // podatke kupaca direktno iz baze — ako middleware ikad zakaže, ovo ostaje.
  if (!isLoginPage) {
    const token = (await cookies()).get('admin_session')?.value;
    if (!(await verifyAdminToken(token))) redirect('/admin/login');
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!isLoginPage && <AdminSidebar />}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}
