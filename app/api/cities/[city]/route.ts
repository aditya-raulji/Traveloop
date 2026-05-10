import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CITIES } from '@/lib/data/cities';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ city: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { city: citySlug } = await params;
    const cityName = decodeURIComponent(citySlug);

    // Find city metadata
    const cityData = CITIES.find(
      (c) => c.name.toLowerCase() === cityName.toLowerCase() ||
             c.id === cityName
    );

    if (!cityData) {
      return NextResponse.json({ error: 'City not found' }, { status: 404 });
    }

    // Fetch activities from database for this city
    const activities = await prisma.activity.findMany({
      where: {
        cityName: {
          equals: cityData.name,
          mode: 'insensitive',
        },
      },
      orderBy: { rating: 'desc' },
      take: 50,
    });

    return NextResponse.json({ city: cityData, activities });
  } catch (error: any) {
    console.error('Error fetching city:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
