import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'GET expenses for trip ' + params.id });
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'POST expense for trip ' + params.id });
}
