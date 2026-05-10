import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'GET all trips' });
}

export async function POST(req: Request) {
  return NextResponse.json({ message: 'POST create trip' });
}
