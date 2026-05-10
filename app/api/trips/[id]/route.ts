import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'GET trip ' + params.id });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'PUT trip ' + params.id });
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ message: 'DELETE trip ' + params.id });
}
