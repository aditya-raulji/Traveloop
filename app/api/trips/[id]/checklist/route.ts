import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    let checklist = await prisma.packingChecklist.findFirst({
      where: { tripId: id },
      include: { items: true }
    });

    if (!checklist) {
      checklist = await prisma.packingChecklist.create({
        data: {
          tripId: id,
          userId: session.user.id,
        },
        include: { items: true }
      });
    }

    return NextResponse.json({ checklist });
  } catch (err) {
    console.error('GET checklist error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const itemSchema = z.object({
  name: z.string(),
  category: z.string(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    
    // Support bulk add via "items" array for templates
    if (body.items && Array.isArray(body.items)) {
      let checklist = await prisma.packingChecklist.findFirst({
        where: { tripId: id }
      });
      if (!checklist) {
        checklist = await prisma.packingChecklist.create({
          data: { tripId: id, userId: session.user.id }
        });
      }
      
      const newItems = body.items.map((i: any) => ({
        checklistId: checklist!.id,
        name: i.name,
        category: i.category,
      }));
      
      await prisma.packingItem.createMany({
        data: newItems
      });
      
      const updatedChecklist = await prisma.packingChecklist.findUnique({
        where: { id: checklist.id },
        include: { items: true }
      });
      
      return NextResponse.json({ checklist: updatedChecklist }, { status: 201 });
    }

    // Single item add
    const data = itemSchema.parse(body);
    let checklist = await prisma.packingChecklist.findFirst({
      where: { tripId: id }
    });
    if (!checklist) {
      checklist = await prisma.packingChecklist.create({
        data: { tripId: id, userId: session.user.id }
      });
    }

    const item = await prisma.packingItem.create({
      data: {
        checklistId: checklist.id,
        name: data.name,
        category: data.category,
      }
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    }
    console.error('POST checklist item error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  try {
     const checklist = await prisma.packingChecklist.findFirst({
      where: { tripId: id }
    });
    if(checklist) {
        await prisma.packingItem.deleteMany({
            where: { checklistId: checklist.id }
        })
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE checklist error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
