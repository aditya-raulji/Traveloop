import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: { _count: { select: { trips: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="font-serif italic text-4xl text-earth">Users Management</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-earth/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-paper-dark border-b border-earth/10">
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">User</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Email</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Role</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Trips</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Joined</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any, i: number) => (
              <tr key={user.id} className="border-b border-earth/5 hover:bg-paper/30 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center overflow-hidden">
                      {user.image ? <img src={user.image} className="w-full h-full object-cover" /> : <span className="font-serif italic text-gold">{user.name?.[0] || 'U'}</span>}
                    </div>
                    <span className="font-medium text-earth">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 text-earth-muted">{user.email}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-gold/20 text-gold-dark' : 'bg-earth/10 text-earth'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-earth-muted font-medium">{user._count.trips}</td>
                <td className="p-4 text-earth-muted">{format(new Date(user.createdAt), 'MMM d, yyyy')}</td>
                <td className="p-4 text-right">
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger className="p-2 hover:bg-earth/5 rounded-full transition-colors text-earth-muted">
                      <MoreHorizontal size={20} />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" className="bg-white rounded-xl shadow-lg border border-earth/10 py-2 w-48 z-50">
                        <DropdownMenu.Item className="px-4 py-2 text-sm text-earth hover:bg-paper outline-none cursor-pointer">
                          View Details
                        </DropdownMenu.Item>
                        <DropdownMenu.Item className="px-4 py-2 text-sm text-earth hover:bg-paper outline-none cursor-pointer">
                          Make Admin
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator className="h-px bg-earth/10 my-1" />
                        <DropdownMenu.Item className="px-4 py-2 text-sm text-error hover:bg-error/5 outline-none cursor-pointer">
                          Delete User
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
