import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const json = await req.json();
    const { liked } = json;

    const post = await prisma.communityPost.findUnique({ where: { id } });
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

    const updatedPost = await prisma.communityPost.update({
      where: { id },
      data: {
        likes: liked ? { increment: 1 } : { decrement: 1 }
      }
    });

    return NextResponse.json({ likes: updatedPost.likes });
  } catch (err) {
    console.error('POST community like error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
