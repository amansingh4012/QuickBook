const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Database URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    
    await prisma.$connect();
    console.log('✅ Successfully connected to database!');
    
    // Try a simple query
    const result = await prisma.$queryRaw`SELECT NOW() as current_time`;
    console.log('✅ Database query successful:', result);
    
    await prisma.$disconnect();
    console.log('✅ Disconnected successfully');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
