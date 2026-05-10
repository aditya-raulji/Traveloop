import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const postSchema = z.object({
  tripId: z.string(),
  content: z.string().min(10),
  rating: z.number().min(1).max(5).optional(),
  images: z.array(z.string()).optional()
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const sort = searchParams.get('sort') || 'latest';
  
  try {
    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'liked') orderBy = { likes: 'desc' };
    
    const posts = await prisma.communityPost.findMany({
      include: {
        user: { select: { id: true, name: true, image: true } },
        trip: { select: { id: true, name: true, stops: { select: { cityName: true } } } }
      },
      orderBy,
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error('GET community error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const json = await req.json();
    const data = postSchema.parse(json);

    const trip = await prisma.trip.findUnique({ where: { id: data.tripId } });
    if (!trip || trip.userId !== session.user.id) {
      return NextResponse.json({ error: 'Trip not found or unauthorized' }, { status: 403 });
    }

    const post = await prisma.communityPost.create({
      data: {
        tripId: data.tripId,
        userId: session.user.id,
        content: data.content,
        rating: data.rating,
        images: data.images || []
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        trip: { select: { id: true, name: true, stops: { select: { cityName: true } } } }
      }
    });

    // Make the trip public so others can view it from the community
    await prisma.trip.update({
      where: { id: data.tripId },
      data: { isPublic: true }
    });

    return NextResponse.json({ post }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    }
    console.error('POST community error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
