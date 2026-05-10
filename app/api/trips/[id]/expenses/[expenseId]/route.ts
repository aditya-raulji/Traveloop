import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, expenseId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, expenseId } = await params;

  try {
    // Verify trip ownership
    const trip = await prisma.trip.findUnique({
      where: { id },
      select: { userId: true }
    });
    if (trip?.userId !== session.user.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await prisma.expense.delete({
      where: { id: expenseId }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE expense error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
