import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6)
});

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const json = await req.json();
    const { currentPassword, newPassword } = schema.parse(json);

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    if (!user.password) return NextResponse.json({ error: 'OAuth users cannot change password' }, { status: 400 });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
