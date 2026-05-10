import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, itemId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await params;

  try {
    const body = await req.json();
    const item = await prisma.packingItem.update({
      where: { id: itemId },
      data: { isPacked: body.isPacked }
    });
    return NextResponse.json({ item });
  } catch (err) {
    console.error('PUT checklist item error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, itemId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { itemId } = await params;

  try {
    await prisma.packingItem.delete({
      where: { id: itemId }
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE checklist item error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
