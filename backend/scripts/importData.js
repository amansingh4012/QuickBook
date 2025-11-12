const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function importData() {
  try {
    console.log('🚀 Starting data import to PostgreSQL...\n');
    
    // Read exported data
    const exportPath = path.join(__dirname, 'data_export.json');
    
    if (!fs.existsSync(exportPath)) {
      throw new Error('data_export.json not found. Please run exportData.js first!');
    }
    
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
    
    console.log('📊 Data to Import:');
    console.log('─'.repeat(40));
    console.log(`👥 Users: ${data.users.length}`);
    console.log(`🎬 Cinemas: ${data.cinemas.length}`);
    console.log(`📺 Screens: ${data.screens.length}`);
    console.log(`🎥 Movies: ${data.movies.length}`);
    console.log(`🎪 Shows: ${data.shows.length}`);
    console.log(`🎫 Bookings: ${data.bookings.length}`);
    console.log(`💳 Payments: ${data.payments.length}`);
    console.log(`🔒 Seat Holds: ${data.seatHolds.length}`);
    console.log('─'.repeat(40) + '\n');

    // Import in order due to foreign key constraints
    
    // 1. Users
    if (data.users.length > 0) {
      console.log('👥 Importing users...');
      for (const user of data.users) {
        await prisma.user.create({
          data: {
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            phone: user.phone,
            address: user.address,
            city: user.city,
            state: user.state,
            pincode: user.pincode,
            dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth) : null,
            profilePicture: user.profilePicture,
            role: user.role,
            createdAt: new Date(user.createdAt),
            updatedAt: new Date(user.updatedAt)
          }
        });
      }
      console.log(`   ✓ Imported ${data.users.length} users\n`);
    }

    // 2. Cinemas
    if (data.cinemas.length > 0) {
      console.log('🎬 Importing cinemas...');
      for (const cinema of data.cinemas) {
        await prisma.cinema.create({
          data: {
            id: cinema.id,
            name: cinema.name,
            city: cinema.city,
            createdAt: new Date(cinema.createdAt)
          }
        });
      }
      console.log(`   ✓ Imported ${data.cinemas.length} cinemas\n`);
    }

    // 3. Screens
    if (data.screens.length > 0) {
      console.log('📺 Importing screens...');
      for (const screen of data.screens) {
        await prisma.screen.create({
          data: {
            id: screen.id,
            name: screen.name,
            cinemaId: screen.cinemaId
          }
        });
      }
      console.log(`   ✓ Imported ${data.screens.length} screens\n`);
    }

    // 4. Movies
    if (data.movies.length > 0) {
      console.log('🎥 Importing movies...');
      for (const movie of data.movies) {
        await prisma.movie.create({
          data: {
            id: movie.id,
            title: movie.title,
            description: movie.description,
            durationMin: movie.durationMin,
            posterUrl: movie.posterUrl,
            bannerUrl: movie.bannerUrl,
            trailerUrl: movie.trailerUrl,
            genre: movie.genre,
            language: movie.language,
            rating: movie.rating,
            releaseDate: movie.releaseDate ? new Date(movie.releaseDate) : null,
            director: movie.director,
            cast: movie.cast,
            certificate: movie.certificate,
            createdAt: new Date(movie.createdAt),
            updatedAt: new Date(movie.updatedAt)
          }
        });
      }
      console.log(`   ✓ Imported ${data.movies.length} movies\n`);
    }

    // 5. Shows
    if (data.shows.length > 0) {
      console.log('🎪 Importing shows...');
      for (const show of data.shows) {
        await prisma.show.create({
          data: {
            id: show.id,
            movieId: show.movieId,
            screenId: show.screenId,
            startTime: new Date(show.startTime),
            price: show.price
          }
        });
      }
      console.log(`   ✓ Imported ${data.shows.length} shows\n`);
    }

    // 6. Payments
    if (data.payments.length > 0) {
      console.log('💳 Importing payments...');
      for (const payment of data.payments) {
        await prisma.payment.create({
          data: {
            id: payment.id,
            userId: payment.userId,
            amount: payment.amount,
            currency: payment.currency,
            paymentMethod: payment.paymentMethod,
            stripePaymentId: payment.stripePaymentId,
            stripeClientSecret: payment.stripeClientSecret,
            status: payment.status,
            metadata: payment.metadata,
            createdAt: new Date(payment.createdAt),
            updatedAt: new Date(payment.updatedAt)
          }
        });
      }
      console.log(`   ✓ Imported ${data.payments.length} payments\n`);
    }

    // 7. Bookings
    if (data.bookings.length > 0) {
      console.log('🎫 Importing bookings...');
      for (const booking of data.bookings) {
        await prisma.booking.create({
          data: {
            id: booking.id,
            userId: booking.userId,
            showId: booking.showId,
            seats: booking.seats,
            totalPrice: booking.totalPrice,
            status: booking.status,
            paymentId: booking.paymentId,
            paymentStatus: booking.paymentStatus,
            ticketCode: booking.ticketCode,
            createdAt: new Date(booking.createdAt),
            updatedAt: new Date(booking.updatedAt)
          }
        });
      }
      console.log(`   ✓ Imported ${data.bookings.length} bookings\n`);
    }

    // 8. Seat Holds (only valid ones)
    if (data.seatHolds.length > 0) {
      console.log('🔒 Importing seat holds...');
      const validSeatHolds = data.seatHolds.filter(
        sh => new Date(sh.expiresAt) > new Date()
      );
      
      if (validSeatHolds.length > 0) {
        for (const seatHold of validSeatHolds) {
          await prisma.seatHold.create({
            data: {
              id: seatHold.id,
              userId: seatHold.userId,
              showId: seatHold.showId,
              seats: seatHold.seats,
              expiresAt: new Date(seatHold.expiresAt),
              createdAt: new Date(seatHold.createdAt)
            }
          });
        }
        console.log(`   ✓ Imported ${validSeatHolds.length} valid seat holds`);
        console.log(`   ⚠ Skipped ${data.seatHolds.length - validSeatHolds.length} expired seat holds\n`);
      } else {
        console.log(`   ⚠ All seat holds were expired, none imported\n`);
      }
    }

    console.log('✅ Data import completed successfully!\n');
    
    // Reset sequences
    console.log('🔧 Resetting PostgreSQL sequences...');
    await resetSequences();
    console.log('   ✓ Sequences reset\n');
    
    console.log('🎉 Migration Complete!');
    console.log('─'.repeat(40));
    console.log('Next Steps:');
    console.log('1. Start your backend: npm run dev');
    console.log('2. Test API endpoints');
    console.log('3. Verify data in Prisma Studio: npx prisma studio');
    console.log('4. Or check Supabase Table Editor\n');
    
  } catch (error) {
    console.error('❌ Error importing data:', error);
    console.error('Details:', error.message);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure PostgreSQL schema is created: npx prisma migrate dev');
    console.error('2. Check your DATABASE_URL in .env');
    console.error('3. Verify Supabase connection');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

async function resetSequences() {
  try {
    // Reset auto-increment sequences to continue from max ID
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"User"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "User"), 1), 
        (SELECT MAX(id) FROM "User") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Cinema"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Cinema"), 1), 
        (SELECT MAX(id) FROM "Cinema") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Screen"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Screen"), 1), 
        (SELECT MAX(id) FROM "Screen") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Movie"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Movie"), 1), 
        (SELECT MAX(id) FROM "Movie") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Show"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Show"), 1), 
        (SELECT MAX(id) FROM "Show") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Booking"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Booking"), 1), 
        (SELECT MAX(id) FROM "Booking") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"Payment"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "Payment"), 1), 
        (SELECT MAX(id) FROM "Payment") IS NOT NULL);
    `);
    
    await prisma.$executeRawUnsafe(`
      SELECT setval(pg_get_serial_sequence('"SeatHold"', 'id'), 
        COALESCE((SELECT MAX(id) FROM "SeatHold"), 1), 
        (SELECT MAX(id) FROM "SeatHold") IS NOT NULL);
    `);
  } catch (error) {
    console.warn('   ⚠ Could not reset sequences:', error.message);
  }
}

importData();
