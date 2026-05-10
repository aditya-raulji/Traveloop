import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PATCH(
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
    const { startDate, endDate, budget } = body;

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const updateData: any = {};
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;
    if (budget !== undefined) updateData.budget = budget ? parseFloat(budget) : null;

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: updateData,
    });

    return NextResponse.json(updatedStop);
  } catch (error: any) {
    console.error('Error updating stop:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
