import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city');
    const category = searchParams.get('category');
    const q = searchParams.get('q');
    const sort = searchParams.get('sort') ?? 'rating';
    const minCost = searchParams.get('minCost');
    const maxCost = searchParams.get('maxCost');
    const limit = parseInt(searchParams.get('limit') ?? '20');
    const offset = parseInt(searchParams.get('offset') ?? '0');

    const whereClause: any = {};

    if (city) {
      whereClause.city = { contains: city, mode: 'insensitive' };
    }

    if (category && category !== 'All') {
      whereClause.category = { contains: category, mode: 'insensitive' };
    }

    if (q) {
      whereClause.OR = [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { city: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (minCost || maxCost) {
      whereClause.avgCost = {};
      if (minCost) whereClause.avgCost.gte = parseFloat(minCost);
      if (maxCost) whereClause.avgCost.lte = parseFloat(maxCost);
    }

    let orderBy: any = { rating: 'desc' };
    if (sort === 'cost-asc') orderBy = { avgCost: 'asc' };
    else if (sort === 'cost-desc') orderBy = { avgCost: 'desc' };
    else if (sort === 'duration') orderBy = { duration: 'asc' };
    else if (sort === 'rating') orderBy = { rating: 'desc' };

    const [activities, total] = await Promise.all([
      prisma.activity.findMany({
        where: whereClause,
        orderBy,
        take: limit,
        skip: offset,
      }),
      prisma.activity.count({ where: whereClause }),
    ]);

    return NextResponse.json({ activities, total, limit, offset });
  } catch (error: any) {
    console.error('Error fetching activities:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, category, city, country, avgCost, duration } = body;

    if (!name || !category || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const activity = await prisma.activity.create({
      data: {
        name,
        description,
        category,
        city,
        country,
        avgCost: parseFloat(avgCost) || null,
        duration: parseInt(duration) || null,
      },
    });

    return NextResponse.json(activity);
  } catch (error: any) {
    console.error('Error creating activity:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
