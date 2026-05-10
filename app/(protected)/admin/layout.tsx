import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { LayoutDashboard, Users, Map as MapIcon, Building2, MessageSquare, Settings } from 'lucide-react';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== 'admin') {
    redirect('/dashboard');
  }

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Trips', href: '/admin/trips', icon: MapIcon },
    { label: 'Cities & Activities', href: '/admin/cities', icon: Building2 },
    { label: 'Community Posts', href: '/admin/community', icon: MessageSquare },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-paper flex pt-[88px]">
      <aside className="w-64 bg-earth text-paper flex-shrink-0 fixed h-[calc(100vh-88px)] overflow-y-auto hidden md:block">
        <div className="p-6">
          <h2 className="font-serif italic text-2xl text-gold mb-8">Admin Panel</h2>
          <nav className="space-y-2">
            {links.map(link => (
              <Link key={link.href} href={link.href} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-paper/80 hover:text-white">
                <link.icon size={18} />
                <span className="font-medium text-sm">{link.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
      
      <main className="flex-1 md:ml-64 p-4 sm:p-8">
        <nav className="md:hidden flex items-center gap-2 overflow-x-auto pb-6 scrollbar-hide">
          {links.map(link => (
            <Link 
              key={link.href} 
              href={link.href} 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-earth text-paper whitespace-nowrap text-xs font-medium"
            >
              <link.icon size={14} />
              {link.label}
            </Link>
          ))}
        </nav>
        {children}
      </main>
    </div>
  );
}
