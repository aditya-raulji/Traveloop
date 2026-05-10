import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import PublicTripClient from './PublicTripClient';
import { Lock } from 'lucide-react';
import Link from 'next/link';

export default async function PublicTripPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, image: true } },
      stops: {
        orderBy: { order: 'asc' },
        include: {
          activities: {
            include: { activity: true },
            orderBy: { date: 'asc' },
          },
        },
      },
      expenses: {
        orderBy: { date: 'asc' }
      },
    },
  });

  if (!trip) {
    notFound();
  }

  if (!trip.isPublic) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-earth-muted/10 max-w-md mx-4">
          <div className="w-16 h-16 bg-earth-light text-earth rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-3xl text-earth mb-2 italic">Private Trip</h2>
          <p className="text-earth-muted text-sm mb-6">The owner has not made this itinerary public.</p>
          <Link href="/" className="inline-block px-8 py-3 bg-earth text-white rounded-full text-sm font-medium hover:bg-earth-dark transition-colors">
            Go to Traveloop
          </Link>
        </div>
      </div>
    );
  }

  return <PublicTripClient trip={trip} />;
}
