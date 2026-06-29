import bcrypt from 'bcryptjs';
import { PrismaClient } from '/home/liantsoa/Documents/ExamenFinalWeb3/event-page-manager/event-page-manager/app/generated/prisma/index.js';

const prisma = new PrismaClient();
const hash = await bcrypt.hash('admin123', 10);
await prisma.user.upsert({
  where: { username: 'admin' },
  update: { password: hash },
  create: { username: 'admin', email: 'admin@eventsync.dev', password: hash, fullName: 'Admin EventSync', role: 'admin' }
});
console.log('Done');
await prisma.$disconnect();
