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

export async function PUT(req: Request, { params }: { params: Promise<{ id: string, noteId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, noteId } = await params;

  try {
    const note = await prisma.tripNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== session.user.id || note.tripId !== id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 403 });
    }

    const json = await req.json();
    const data = noteSchema.parse(json);

    const updatedNote = await prisma.tripNote.update({
      where: { id: noteId },
      data: {
        title: data.title,
        content: data.content,
        stopId: data.stopId,
        day: data.day
      }
    });

    return NextResponse.json({ note: updatedNote });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    console.error('PUT note error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string, noteId: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id, noteId } = await params;

  try {
    const note = await prisma.tripNote.findUnique({ where: { id: noteId } });
    if (!note || note.userId !== session.user.id || note.tripId !== id) {
      return NextResponse.json({ error: 'Not found or unauthorized' }, { status: 403 });
    }

    await prisma.tripNote.delete({ where: { id: noteId } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE note error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
