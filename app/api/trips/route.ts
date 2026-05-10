import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      orderBy: { startDate: 'asc' },
      include: {
        stops: { select: { id: true } }
      }
    });
    return NextResponse.json(trips);
  } catch (err) {
    console.error('GET /api/trips error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const createTripSchema = z.object({
  name: z.string().min(2, 'Trip name required'),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  budget: z.number().optional(),
  currency: z.string().optional(),
  coverImage: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

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
        currency: data.currency ?? 'USD',
        coverImage: data.coverImage,
        status: 'DRAFT',
      }
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
