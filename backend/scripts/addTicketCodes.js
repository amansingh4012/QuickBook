/**
 * Script to add ticket codes to existing bookings
 * Run this once to update old bookings with ticket codes
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const generateTicketCode = () => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `QB-${dateStr}-${random}`;
};

async function addTicketCodesToExistingBookings() {
  try {
    console.log('🔍 Finding bookings without ticket codes...');
    
    // Find all confirmed bookings without ticket codes
    const bookingsWithoutCodes = await prisma.booking.findMany({
      where: {
        ticketCode: null,
        status: 'CONFIRMED'
      }
    });

    console.log(`📋 Found ${bookingsWithoutCodes.length} bookings without ticket codes`);

    if (bookingsWithoutCodes.length === 0) {
      console.log('✅ All confirmed bookings already have ticket codes!');
      return;
    }

    console.log('🎫 Generating and adding ticket codes...');
    
    let updated = 0;
    for (const booking of bookingsWithoutCodes) {
      const ticketCode = generateTicketCode();
      
      try {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { ticketCode }
        });
        
        console.log(`✓ Booking #${booking.id} -> ${ticketCode}`);
        updated++;
      } catch (error) {
        if (error.code === 'P2002') {
          // Unique constraint violation, try again with new code
          console.log(`⚠️ Duplicate ticket code, retrying for booking #${booking.id}`);
          const newCode = generateTicketCode();
          await prisma.booking.update({
            where: { id: booking.id },
            data: { ticketCode: newCode }
          });
          console.log(`✓ Booking #${booking.id} -> ${newCode} (retry)`);
          updated++;
        } else {
          throw error;
        }
      }
    }

    console.log('\n✅ Successfully updated all bookings!');
    console.log(`📊 Total bookings updated: ${updated}`);
    
  } catch (error) {
    console.error('❌ Error updating bookings:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addTicketCodesToExistingBookings()
  .then(() => {
    console.log('\n🎉 Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
