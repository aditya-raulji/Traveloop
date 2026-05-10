import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MapPin, Plus, Search, Calendar, Users } from 'lucide-react';
import { TripCard } from '@/components/trips/TripCard';
import { DestinationCard, destinations } from '@/components/destinations/DestinationCard';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/login');

  let trips: any[] = [];
  let dbError = false;

  try {
    trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'asc' },
      include: { stops: { select: { id: true } } }
    });
  } catch (err) {
    console.error('Dashboard DB error:', err);
    dbError = true;
  }

  const ongoing = trips.filter(t => t.status === 'ONGOING');
  const upcoming = trips.filter(t => t.status === 'UPCOMING' || (t.status === 'DRAFT' && t.startDate && new Date(t.startDate) > new Date()));
  const drafts = trips.filter(t => t.status === 'DRAFT' && (!t.startDate || new Date(t.startDate) <= new Date()));
  const completed = trips.filter(t => t.status === 'COMPLETED');

  const firstName = session.user.name?.split(' ')[0] || 'Traveler';

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16 flex flex-col gap-10 md:gap-14">

      {/* HEADER */}
      <div className="relative z-10">
        <p className="font-body text-earth-muted text-sm uppercase tracking-widest mb-2">Dashboard</p>
        <h1 className="font-heading italic text-[42px] md:text-[52px] text-earth leading-tight mb-1">
          {getGreeting()}, {firstName}
        </h1>
        <p className="font-body text-earth-muted text-lg">Where are you headed next?</p>
      </div>

      {/* COMPACT SEARCH BAR */}
      <div className="bg-white/80 border border-gold/30 rounded-pill px-5 py-3 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex flex-col md:flex-row flex-1 gap-3 md:gap-0 w-full">
          <div className="flex items-center gap-3 flex-1 md:pr-5 md:border-r border-earth-muted/20">
            <MapPin size={16} className="text-gold flex-shrink-0" />
            <input type="text" placeholder="Where to?" className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/50 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3 flex-1 md:px-5 md:border-r border-earth-muted/20">
            <Calendar size={16} className="text-gold flex-shrink-0" />
            <input type="text" placeholder="When?" className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/50 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3 flex-1 md:pl-5">
            <Users size={16} className="text-gold flex-shrink-0" />
            <input type="text" placeholder="Travelers" className="flex-1 bg-transparent font-body text-earth placeholder:text-earth-muted/50 outline-none text-sm" />
          </div>
        </div>
        <button className="bg-gold text-white rounded-pill px-5 py-2.5 text-sm font-body font-medium hover:bg-[#B58A40] transition-colors flex items-center gap-2 flex-shrink-0 w-full md:w-auto justify-center">
          <Search size={14} />
          Find →
        </button>
      </div>

      {/* UPCOMING TRIPS */}
      <div>
        <div className="flex justify-between items-center mb-7">
          <h2 className="font-heading italic text-[34px] text-earth">Your Trips</h2>
          <Link
            href="/trips/new"
            className="flex items-center gap-2 bg-gold text-white rounded-pill px-5 py-2.5 text-sm font-body font-medium hover:bg-[#B58A40] transition-colors"
          >
            <Plus size={16} />
            Plan New Trip
          </Link>
        </div>

        {dbError && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-body mb-6">
            Could not connect to the database. Check your DATABASE_URL in .env.local.
          </div>
        )}

        {!dbError && trips.length === 0 ? (
          <div className="border-2 border-dashed border-earth-muted/25 rounded-[24px] p-14 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-paper-dark flex items-center justify-center text-gold">
              <MapPin size={32} />
            </div>
            <h3 className="font-heading italic text-2xl text-earth">No trips yet. Let's change that.</h3>
            <p className="font-body text-earth-muted text-sm max-w-sm">
              Every great adventure starts with a plan. Create your first trip and let Traveloop guide you.
            </p>
            <Link
              href="/trips/new"
              className="bg-gold text-white rounded-pill px-6 py-3 text-sm font-body font-medium hover:bg-[#B58A40] transition-colors flex items-center gap-2 mt-2"
            >
              <Plus size={16} />
              Draft your first trip →
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-10">
            {/* Ongoing */}
            {ongoing.length > 0 && (
              <div>
                <h3 className="font-body text-xs uppercase tracking-widest text-forest mb-4">⬤ Ongoing</h3>
                <div className="flex flex-col gap-4">
                  {ongoing.map(t => (
                    <TripCard key={t.id} variant="compact" {...t} stopsCount={t.stops?.length ?? 0} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div>
                <h3 className="font-body text-xs uppercase tracking-widest text-gold mb-4">◆ Upcoming</h3>
                <div className="flex flex-col gap-4">
                  {upcoming.map(t => (
                    <TripCard key={t.id} variant="compact" {...t} stopsCount={t.stops?.length ?? 0} />
                  ))}
                </div>
              </div>
            )}

            {/* Drafts */}
            {drafts.length > 0 && (
              <div>
                <h3 className="font-body text-xs uppercase tracking-widest text-earth-muted mb-4">✏ Drafts</h3>
                <div className="flex flex-col gap-4">
                  {drafts.map(t => (
                    <TripCard key={t.id} variant="compact" {...t} stopsCount={t.stops?.length ?? 0} />
                  ))}
                </div>
              </div>
            )}

            {/* Completed (collapsed style) */}
            {completed.length > 0 && (
              <div>
                <h3 className="font-body text-xs uppercase tracking-widest text-earth-muted/60 mb-4">✓ Completed ({completed.length})</h3>
                <div className="flex flex-col gap-4 opacity-60">
                  {completed.slice(0, 2).map(t => (
                    <TripCard key={t.id} variant="compact" {...t} stopsCount={t.stops?.length ?? 0} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* EXPLORE DESTINATIONS */}
      <div>
        <div className="mb-8">
          <h2 className="font-heading italic text-[34px] text-earth mb-1">Explore destinations</h2>
          <p className="font-body text-earth-muted text-sm">Discover your next adventure</p>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
          {destinations.map(dest => (
            <div key={dest.city} className="snap-start flex-shrink-0">
              <DestinationCard {...dest} size="sm" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
