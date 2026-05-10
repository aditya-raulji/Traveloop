import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import ItineraryBuilder from '@/components/trips/ItineraryBuilder';
import Link from 'next/link';
import { ArrowLeft, MapPin } from 'lucide-react';
import { format } from 'date-fns';

export default async function TripBuildPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      stops: {
        orderBy: { order: 'asc' },
        include: {
          activities: {
            include: {
              activity: true,
            },
            orderBy: { date: 'asc' },
          },
        },
      },
      expenses: true,
    },
  });

  if (!trip || trip.userId !== session.user.id) {
    notFound();
  }

  // Calculate some overview stats
  const totalBudget = trip.budget || 0;
  const spent = trip.expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remaining = totalBudget - spent;
  
  const tripDuration = trip.startDate && trip.endDate 
    ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) 
    : 0;

  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-earth-light">
      {/* LEFT SIDEBAR */}
      <aside className="hidden md:flex w-[280px] flex-col border-r border-earth-muted/20 bg-white/50 backdrop-blur-sm">
        <div className="p-6 flex-1 overflow-y-auto">
          <Link href={`/trips/${trip.id}`} className="inline-flex items-center text-sm text-earth-muted hover:text-earth mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Overview
          </Link>

          <h1 className="font-serif text-3xl italic text-earth mb-2">{trip.name}</h1>
          
          {trip.startDate && trip.endDate && (
            <p className="text-sm text-earth-muted mb-6">
              {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d, yyyy')}
              <span className="mx-2">•</span>
              {tripDuration} days
            </p>
          )}

          <div className="space-y-1 mt-8">
            <div className="px-3 py-2 text-sm font-medium text-earth bg-gold/10 rounded-lg">
              Itinerary Overview
            </div>
            
            <div className="mt-4 space-y-2 relative pl-4 border-l-2 border-gold/30 ml-3">
              {trip.stops.map((stop, i) => (
                <div key={stop.id} className="relative group">
                  <div className="absolute w-2.5 h-2.5 bg-gold rounded-full -left-[21px] top-1.5 ring-4 ring-white" />
                  <a href={`#stop-${stop.id}`} className="block px-3 py-1.5 text-sm text-earth-muted hover:text-earth transition-colors">
                    {stop.cityName}
                  </a>
                </div>
              ))}
              <div className="relative group pt-2">
                <div className="absolute w-2 h-2 border-2 border-gold/50 rounded-full -left-[20px] top-4 bg-white" />
                <button className="text-sm text-gold hover:text-gold-dark italic px-3 py-1.5 transition-colors">
                  + Add another stop
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Summary */}
        <div className="p-6 border-t border-earth-muted/20 bg-white">
          <h3 className="text-sm font-medium text-earth mb-3">Budget Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-earth-muted">Total:</span>
              <span className="font-medium">${totalBudget.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-earth-muted">Spent:</span>
              <span className="font-medium">${spent.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-earth-muted/20">
              <span className="text-earth-muted">Remaining:</span>
              <span className={`font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                ${remaining.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3 overflow-hidden">
              <div 
                className={`h-full ${remaining < 0 ? 'bg-red-500' : 'bg-gold'}`} 
                style={{ width: `${Math.min((spent / (totalBudget || 1)) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden">
        <ItineraryBuilder trip={trip as any} />
      </main>
    </div>
  );
}
