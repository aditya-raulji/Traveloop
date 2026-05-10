import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().optional(),
  bio: z.string().max(300).optional().nullable(),
  city: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  image: z.string().url().optional().nullable()
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        city: true,
        country: true,
        trips: { where: { isPublic: true }, select: { id: true, name: true, coverImage: true } },
        reviews: { select: { id: true } }
      }
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json(user);
  } catch (err) {
    console.error('GET user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  
  if (!session?.user?.id || session.user.id !== id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const json = await req.json();
    const data = userSchema.parse(json);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        bio: data.bio,
        city: data.city,
        country: data.country,
        phone: data.phone,
        image: data.image
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        city: true,
        country: true,
        phone: true,
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    console.error('PUT user error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
