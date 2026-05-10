import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import EditTripClient from './EditTripClient';

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/login');
  }

  const { id } = await params;

  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip || trip.userId !== session.user.id) {
    notFound();
  }

  return <EditTripClient trip={trip} />;
}
