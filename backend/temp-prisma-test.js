require('dotenv').config({ override: true });
const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const adapter = new PrismaMariaDb({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
(async () => {
  try {
    console.log('DATABASE_URL:', process.env.DATABASE_URL);
    await prisma.$connect();
    console.log('PRISMA CONNECT OK');
    const users = await prisma.user.findMany();
    console.log('FOUND', users.length);
  } catch (err) {
    console.error('PRISMA ERROR');
    console.error(err);
    if (err.meta) console.error('META', err.meta);
  } finally {
    await prisma.$disconnect();
  }
})();
