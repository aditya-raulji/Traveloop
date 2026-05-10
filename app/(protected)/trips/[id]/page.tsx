import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import TripClient from './TripClient';

export default async function TripPage({ params }: { params: Promise<{ id: string }> }) {
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
            include: { activity: true },
            orderBy: { date: 'asc' },
          },
        },
      },
      expenses: {
        orderBy: { date: 'asc' },
        include: { stop: true }
      },
      checklist: {
        include: { items: true }
      }
    },
  });

  if (!trip) {
    notFound();
  }

  if (trip.userId !== session.user.id && !trip.isPublic) {
    notFound();
  }

  return <TripClient trip={trip} isOwner={trip.userId === session.user.id} />;
}
