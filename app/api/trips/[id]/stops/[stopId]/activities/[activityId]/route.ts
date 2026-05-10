import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; stopId: string; activityId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, stopId, activityId } = await params;
    const body = await req.json();
    const { date, cost, notes, done } = body;

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    const updateData: any = {};
    if (date !== undefined) updateData.date = date ? new Date(date) : null;
    if (cost !== undefined) updateData.cost = cost ? parseFloat(cost) : null;
    if (notes !== undefined) updateData.notes = notes;
    if (done !== undefined) updateData.done = Boolean(done);

    const updated = await prisma.stopActivity.update({
      where: { id: activityId },
      data: updateData,
      include: {
        activity: true,
      }
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('Error updating stop activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string; stopId: string; activityId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, activityId } = await params;

    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 404 });
    }

    await prisma.stopActivity.delete({
      where: { id: activityId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting stop activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
