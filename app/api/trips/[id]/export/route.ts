import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { renderToBuffer } from '@react-pdf/renderer';
import { TripPDFDocument } from '@/lib/generateTripPDF';
import React from 'react';

export async function GET(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const session = await getServerSession(authOptions);
  
  const trip = await prisma.trip.findUnique({
    where: { id },
    include: {
      user: true,
      stops: {
        include: {
          city: true,
          activities: { include: { activity: true } },
          expenses: true
        }
      }
    }
  });

  if (!trip) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (!trip.isPublic && trip.userId !== (session?.user as any)?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const tripWithTitle = { ...trip, title: trip.name };

  try {
    const buffer = await renderToBuffer(
      React.createElement(TripPDFDocument as any, { trip: tripWithTitle }) as any
    );

    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="Traveloop_${trip.name.replace(/\s+/g, '_')}.pdf"`
      }
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
