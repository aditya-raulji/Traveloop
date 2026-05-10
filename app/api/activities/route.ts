import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get('q');
  return NextResponse.json({ message: 'GET activities, search: ' + search });
}
