import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

// GET /api/trips/[id]
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  const { id } = await params;

  try {
    const trip = await prisma.trip.findUnique({
      where: { id },
      include: {
        stops: {
          orderBy: { order: 'asc' },
          include: { activities: { include: { activity: true } } }
        },
        expenses: { orderBy: { date: 'asc' } },
        notes: { orderBy: { createdAt: 'asc' } },
        checklist: { include: { items: true } },
      }
    });

    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    if (!trip.isPublic && trip.userId !== session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(trip);
  } catch (err) {
    console.error('GET /api/trips/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  coverImage: z.string().optional(),
  isPublic: z.boolean().optional(),
  status: z.enum(['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED']).optional(),
});

// PUT /api/trips/[id]
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const body = await req.json();
    const data = updateSchema.parse(body);

    const trip = await prisma.trip.update({
      where: { id },
      data: {
        ...data,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
      }
    });

    return NextResponse.json(trip);
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    console.error('PUT /api/trips/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/trips/[id]
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const existing = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    await prisma.trip.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/trips/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export const PATCH = PUT;
