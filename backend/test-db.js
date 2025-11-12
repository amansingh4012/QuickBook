const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');
    
    // Check data
    const userCount = await prisma.user.count();
    const movieCount = await prisma.movie.count();
    const cinemaCount = await prisma.cinema.count();
    const showCount = await prisma.show.count();
    const bookingCount = await prisma.booking.count();
    
    console.log('📊 Current Database Status:');
    console.log('═'.repeat(50));
    console.log(`   👥 Users: ${userCount}`);
    console.log(`   🎥 Movies: ${movieCount}`);
    console.log(`   🎬 Cinemas: ${cinemaCount}`);
    console.log(`   🎪 Shows: ${showCount}`);
    console.log(`   🎫 Bookings: ${bookingCount}`);
    console.log('═'.repeat(50));
    
    if (userCount > 0 && movieCount > 0) {
      console.log('\n✅ Database is populated and ready!');
      console.log('\n🚀 You can now start the server:');
      console.log('   npm run dev');
    } else {
      console.log('\n⚠️  Database is empty. Run: npm run seed');
    }
    
    await prisma.$disconnect();
    console.log('\n✅ Connection test completed!\n');
    
  } catch (error) {
    console.error('\n❌ Database Error:', error.message);
    console.error('\n🔧 Troubleshooting Steps:');
    console.error('   1. Check DATABASE_URL in .env file');
    console.error('   2. Verify Supabase is accessible');
    console.error('   3. Run: npx prisma db push');
    console.error('   4. Check internet connection');
    console.error('\nFull error:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testConnection();
