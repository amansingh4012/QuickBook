const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function exportData() {
  try {
    console.log('🚀 Starting data export from MySQL...\n');
    
    // Fetch all data
    const data = {
      users: await prisma.user.findMany(),
      cinemas: await prisma.cinema.findMany(),
      screens: await prisma.screen.findMany(),
      movies: await prisma.movie.findMany(),
      shows: await prisma.show.findMany(),
      bookings: await prisma.booking.findMany(),
      payments: await prisma.payment.findMany(),
      seatHolds: await prisma.seatHold.findMany()
    };

    // Save to file
    const exportPath = path.join(__dirname, 'data_export.json');
    fs.writeFileSync(
      exportPath,
      JSON.stringify(data, null, 2)
    );

    console.log('✅ Data exported successfully!\n');
    console.log('📊 Export Summary:');
    console.log('─'.repeat(40));
    console.log(`📁 File: ${exportPath}`);
    console.log(`👥 Users: ${data.users.length}`);
    console.log(`🎬 Cinemas: ${data.cinemas.length}`);
    console.log(`📺 Screens: ${data.screens.length}`);
    console.log(`🎥 Movies: ${data.movies.length}`);
    console.log(`🎪 Shows: ${data.shows.length}`);
    console.log(`🎫 Bookings: ${data.bookings.length}`);
    console.log(`💳 Payments: ${data.payments.length}`);
    console.log(`🔒 Seat Holds: ${data.seatHolds.length}`);
    console.log('─'.repeat(40));
    
    // Calculate file size
    const stats = fs.statSync(exportPath);
    const fileSizeInMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`📦 File Size: ${fileSizeInMB} MB\n`);
    
    console.log('✨ Next Steps:');
    console.log('1. Update your .env file with Supabase DATABASE_URL');
    console.log('2. Update prisma/schema.prisma datasource to postgresql');
    console.log('3. Run: npx prisma migrate dev --name init');
    console.log('4. Run: node scripts/importData.js\n');
    
  } catch (error) {
    console.error('❌ Error exporting data:', error);
    console.error('Details:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

exportData();
