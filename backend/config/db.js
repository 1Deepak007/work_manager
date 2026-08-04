const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');

const dbUrl = new URL(process.env.DATABASE_URL);
const adapter = new PrismaMariaDb({
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace(/^\//, ''),
  connectionLimit: 10,
});

const prisma = new PrismaClient({ adapter });

// Connect test
prisma.$connect()
  .then(() => console.log('✅ Connected to MySQL via Prisma: workmanager'))
  .catch((err) => console.error('❌ Prisma DB Connection Error:', err));

module.exports = prisma;