import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const noteSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  stopId: z.string().optional().nullable(),
  day: z.number().optional().nullable()
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    if (trip.userId !== session?.user?.id && !trip.isPublic) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const notes = await prisma.tripNote.findMany({
      where: { tripId: id },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(notes);
  } catch (err) {
    console.error('GET notes error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });
    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const json = await req.json();
    const data = noteSchema.parse(json);

    const note = await prisma.tripNote.create({
      data: {
        tripId: id,
        userId: session.user.id,
        title: data.title,
        content: data.content,
        stopId: data.stopId,
        day: data.day
      }
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    console.error('POST note error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
