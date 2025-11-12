const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn'],
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
});

// Handle connection errors gracefully
prisma.$connect()
  .then(() => console.log('✅ Database connected successfully'))
  .catch((err) => console.error('❌ Database connection failed:', err.message));

module.exports = prisma;