import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; stopId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, stopId } = await params;
    const body = await req.json();
    const { activityId, date, cost, notes, time } = body;

    if (!activityId) {
      return NextResponse.json({ error: 'Activity ID is required' }, { status: 400 });
    }

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const stopActivity = await prisma.stopActivity.create({
      data: {
        stopId,
        activityId,
        date: date ? new Date(date) : null,
        time: time || null,
        cost: cost ? parseFloat(cost) : null,
        notes: notes || null,
      },
      include: {
        activity: true,
      }
    });

    return NextResponse.json(stopActivity);
  } catch (error: any) {
    console.error('Error adding activity to stop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
