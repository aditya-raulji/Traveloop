import { prisma } from './lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const email = 'testuser@example.com';
  const password = await bcrypt.hash('password123', 10);
  
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password,
        name: 'Test User'
      }
    });
  }

  const trip = await prisma.trip.create({
    data: {
      name: 'Euro Trip Test',
      userId: user.id,
      budget: 5000,
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-06-10'),
      status: 'DRAFT',
      stops: {
        create: [
          {
            cityName: 'Paris',
            order: 1,
            startDate: new Date('2026-06-01'),
            endDate: new Date('2026-06-05'),
            budget: 2000
          },
          {
            cityName: 'Rome',
            order: 2,
            startDate: new Date('2026-06-06'),
            endDate: new Date('2026-06-10'),
            budget: 2000
          }
        ]
      }
    }
  });

  console.log(`Trip created with ID: ${trip.id}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
