import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminTripsPage() {
  const trips = await prisma.trip.findMany({
    include: { 
      user: true,
      stops: { include: { city: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <h1 className="font-serif italic text-4xl text-earth">Trips Management</h1>

      <div className="bg-white rounded-[24px] shadow-sm border border-earth/10 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-paper-dark border-b border-earth/10">
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Trip Name</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">User</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Status</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Cities</th>
              <th className="p-4 font-medium text-earth-muted text-sm uppercase tracking-widest">Created</th>
              <th className="p-4"></th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip: any, i: number) => {
              const cityNames = trip.stops.map((s: any) => s.city.cityName).join(', ');
              return (
                <tr key={trip.id} className="border-b border-earth/5 hover:bg-paper/30 transition-colors">
                  <td className="p-4">
                    <Link href={`/trips/${trip.id}`} className="font-medium text-earth hover:text-gold transition-colors">
                      {trip.title}
                    </Link>
                  </td>
                  <td className="p-4 text-earth-muted">{trip.user?.name || 'Unknown'}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${trip.isPublic ? 'bg-forest/20 text-forest' : 'bg-earth/10 text-earth'}`}>
                      {trip.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>
                  <td className="p-4 text-earth-muted truncate max-w-[200px]">{cityNames || 'None'}</td>
                  <td className="p-4 text-earth-muted">{format(new Date(trip.createdAt), 'MMM d, yyyy')}</td>
                  <td className="p-4 text-right">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger className="p-2 hover:bg-earth/5 rounded-full transition-colors text-earth-muted">
                        <MoreHorizontal size={20} />
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Portal>
                        <DropdownMenu.Content align="end" className="bg-white rounded-xl shadow-lg border border-earth/10 py-2 w-48 z-50">
                          <DropdownMenu.Item className="px-4 py-2 text-sm text-earth hover:bg-paper outline-none cursor-pointer">
                            <Link href={`/trips/${trip.id}`}>View Trip</Link>
                          </DropdownMenu.Item>
                          <DropdownMenu.Item className="px-4 py-2 text-sm text-earth hover:bg-paper outline-none cursor-pointer">
                            <a href={`/api/trips/${trip.id}/export`} target="_blank">Export PDF</a>
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator className="h-px bg-earth/10 my-1" />
                          <DropdownMenu.Item className="px-4 py-2 text-sm text-error hover:bg-error/5 outline-none cursor-pointer">
                            Delete Trip
                          </DropdownMenu.Item>
                        </DropdownMenu.Content>
                      </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
