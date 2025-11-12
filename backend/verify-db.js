const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function verify() {
  try {
    const users = await prisma.user.count();
    const movies = await prisma.movie.count();
    const cinemas = await prisma.cinema.count();
    const screens = await prisma.screen.count();
    const shows = await prisma.show.count();
    const bookings = await prisma.booking.count();
    
    console.log('\n📊 Current Database Status:');
    console.log('═'.repeat(50));
    console.log('👥 Users:', users);
    console.log('🎥 Movies:', movies);
    console.log('🎬 Cinemas:', cinemas);
    console.log('📺 Screens:', screens);
    console.log('🎪 Shows:', shows);
    console.log('🎫 Bookings:', bookings);
    console.log('═'.repeat(50));
    
    if(users === 0 && movies === 0 && cinemas === 0 && bookings === 0) {
      console.log('\n✅ Database is completely EMPTY and READY!');
      console.log('\n🚀 Your database is set up from scratch!');
      console.log('\n📝 Next Steps:');
      console.log('   1. Start backend: npm run dev (or nodemon src/server.js)');
      console.log('   2. Start frontend: cd ../frontend && npm run dev');
      console.log('   3. Register your first admin account');
      console.log('   4. Add movies, cinemas, and shows through admin panel');
      console.log('\n💡 Or run: npm run seed (to add sample data)');
    } else {
      console.log('\n⚠️  Database contains some data');
    }
    
    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Error:', error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

verify();
