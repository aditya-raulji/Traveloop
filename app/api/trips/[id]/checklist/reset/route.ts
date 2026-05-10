import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const checklist = await prisma.packingChecklist.findFirst({
      where: { tripId: id }
    });

    if (checklist) {
      await prisma.packingItem.updateMany({
        where: { checklistId: checklist.id },
        data: { isPacked: false }
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('PUT reset checklist error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
