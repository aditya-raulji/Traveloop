import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

const stopSchema = z.object({
  cityName: z.string().min(1),
  country: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  notes: z.string().optional(),
  order: z.number(),
});

// POST /api/trips/[id]/stops
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const body = await req.json();
    const data = stopSchema.parse(body);

    const stop = await prisma.tripStop.create({
      data: {
        tripId: id,
        cityName: data.cityName,
        country: data.country ?? '',
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        budget: data.budget,
        notes: data.notes,
        order: data.order,
      }
    });

    return NextResponse.json(stop, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    console.error('POST /api/trips/[id]/stops error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET /api/trips/[id]/stops
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const trip = await prisma.trip.findFirst({ where: { id, userId: session.user.id } });
    if (!trip) return NextResponse.json({ error: 'Trip not found' }, { status: 404 });

    const stops = await prisma.tripStop.findMany({
      where: { tripId: id },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(stops);
  } catch (err) {
    console.error('GET /api/trips/[id]/stops error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
