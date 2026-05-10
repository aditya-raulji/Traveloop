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
    const expenses = await prisma.expense.findMany({
      where: { tripId: id },
      orderBy: { date: 'asc' },
      include: { stop: true }
    });
    return NextResponse.json({ expenses });
  } catch (err) {
    console.error('GET expenses error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

const expenseSchema = z.object({
  category: z.string(),
  description: z.string(),
  amount: z.number(),
  date: z.string(),
  stopId: z.string().optional().nullable(),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const data = expenseSchema.parse(body);

    const expense = await prisma.expense.create({
      data: {
        tripId: id,
        category: data.category,
        description: data.description,
        amount: data.amount,
        date: new Date(data.date),
        stopId: data.stopId || null,
      },
      include: { stop: true }
    });

    return NextResponse.json({ expense }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: (err as any).errors }, { status: 400 });
    }
    console.error('POST expense error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
