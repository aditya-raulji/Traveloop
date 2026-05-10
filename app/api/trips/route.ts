import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

// GET /api/trips — fetch all trips for authenticated user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') ?? 'startDate';

  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId: session.user.id,
        ...(status ? { status } : {}),
        ...(search ? { name: { contains: search, mode: 'insensitive' } } : {}),
      },
      orderBy: sort === 'name' ? { name: 'asc' }
        : sort === 'budget' ? { budget: 'desc' }
        : { startDate: 'asc' },
      include: {
        stops: { select: { id: true, cityName: true, country: true }, orderBy: { order: 'asc' } },
        _count: { select: { expenses: true } }
      }
    });
    return NextResponse.json(trips);
  } catch (err) {
    console.error('GET /api/trips error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const stopSchema = z.object({
  cityName: z.string(),
  country: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  order: z.number(),
});

const createTripSchema = z.object({
  name: z.string().min(2, 'Trip name is required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  coverImage: z.string().optional(),
  isPublic: z.boolean().optional(),
  stops: z.array(stopSchema).optional(),
});

// POST /api/trips — create new trip with optional stops
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = createTripSchema.parse(body);

    const trip = await prisma.trip.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        budget: data.budget,
        coverImage: data.coverImage,
        isPublic: data.isPublic ?? false,
        status: 'DRAFT',
        stops: data.stops?.length ? {
          create: data.stops.map(s => ({
            cityName: s.cityName,
            country: s.country ?? '',
            startDate: s.startDate ? new Date(s.startDate) : null,
            endDate: s.endDate ? new Date(s.endDate) : null,
            budget: s.budget,
            order: s.order,
          }))
        } : undefined
      },
      include: { stops: true }
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.errors }, { status: 400 });
    }
    console.error('POST /api/trips error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
