import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'GET stops for trip ' + params.id });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'POST stop for trip ' + params.id });
}
