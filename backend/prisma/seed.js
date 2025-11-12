const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  
  // Clear existing data
  console.log('Clearing existing data...');
  await prisma.seatHold.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.show.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();
  console.log('✅ Cleared all existing data\n');

  // Create sample users
  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@quickbook.com',
      password: hashedPassword,
      phone: '+919876543210',
      role: 'ADMIN',
    },
  });

  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
      phone: '+919876543211',
      role: 'USER',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
      phone: '+919876543212',
      role: 'USER',
    },
  });

  console.log('✅ Created 3 users (1 admin, 2 regular users)\n');

  // Create sample movies
  console.log('Creating movies...');
  const movies = [];

  const movieData = [
    {
      title: 'Inception',
      description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
      durationMin: 148,
      posterUrl: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=YoHD9XEInc0',
      genre: 'Action, Sci-Fi, Thriller',
      language: 'English',
      rating: '8.8',
      releaseDate: new Date('2010-07-16'),
      director: 'Christopher Nolan',
      cast: 'Leonardo DiCaprio, Joseph Gordon-Levitt, Ellen Page, Tom Hardy',
      certificate: 'U/A',
    },
    {
      title: 'The Dark Knight',
      description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests.',
      durationMin: 152,
      posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=EXeTwQWrcwY',
      genre: 'Action, Crime, Drama',
      language: 'English',
      rating: '9.0',
      releaseDate: new Date('2008-07-18'),
      director: 'Christopher Nolan',
      cast: 'Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine',
      certificate: 'U/A',
    },
    {
      title: 'Interstellar',
      description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
      durationMin: 169,
      posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=zSWdZVtXT7E',
      genre: 'Adventure, Drama, Sci-Fi',
      language: 'English',
      rating: '8.6',
      releaseDate: new Date('2014-11-07'),
      director: 'Christopher Nolan',
      cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain',
      certificate: 'U/A',
    },
    {
      title: 'Avengers: Endgame',
      description: 'After the devastating events of Infinity War, the Avengers assemble once more to restore order to the universe.',
      durationMin: 181,
      posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
      genre: 'Action, Adventure, Sci-Fi',
      language: 'English',
      rating: '8.4',
      releaseDate: new Date('2019-04-26'),
      director: 'Anthony Russo, Joe Russo',
      cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Scarlett Johansson',
      certificate: 'U/A',
    },
    {
      title: 'Oppenheimer',
      description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
      durationMin: 180,
      posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
      bannerUrl: 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg',
      trailerUrl: 'https://www.youtube.com/watch?v=uYPbbksJxIg',
      genre: 'Biography, Drama, History',
      language: 'English',
      rating: '8.5',
      releaseDate: new Date('2023-07-21'),
      director: 'Christopher Nolan',
      cast: 'Cillian Murphy, Emily Blunt, Matt Damon, Robert Downey Jr.',
      certificate: 'A',
    },
  ];

  for (const data of movieData) {
    const movie = await prisma.movie.create({ data });
    movies.push(movie);
  }
  console.log(`✅ Created ${movies.length} movies\n`);

  // Create sample cinemas with screens
  console.log('Creating cinemas and screens...');
  const cinema1 = await prisma.cinema.create({
    data: {
      name: 'PVR Cinemas',
      city: 'Mumbai',
      screens: {
        create: [
          { name: 'Screen 1' },
          { name: 'Screen 2' },
          { name: 'IMAX Screen' },
        ],
      },
    },
    include: { screens: true },
  });

  const cinema2 = await prisma.cinema.create({
    data: {
      name: 'INOX Megaplex',
      city: 'Delhi',
      screens: {
        create: [
          { name: 'Audi 1' },
          { name: 'Audi 2' },
        ],
      },
    },
    include: { screens: true },
  });

  const cinema3 = await prisma.cinema.create({
    data: {
      name: 'Cinepolis',
      city: 'Bangalore',
      screens: {
        create: [
          { name: 'Screen A' },
          { name: 'Screen B' },
        ],
      },
    },
    include: { screens: true },
  });

  const allScreens = [...cinema1.screens, ...cinema2.screens, ...cinema3.screens];
  console.log(`✅ Created 3 cinemas with ${allScreens.length} screens\n`);

  // Create shows for the next 7 days
  console.log('Creating shows...');
  const shows = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showTimes = [
    { hour: 10, minute: 0 },
    { hour: 13, minute: 30 },
    { hour: 17, minute: 0 },
    { hour: 20, minute: 30 },
  ];

  const prices = [200, 250, 300, 350];

  // Create shows for next 7 days
  for (let day = 0; day < 7; day++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + day);

    for (const screen of allScreens) {
      const numShows = Math.floor(Math.random() * 2) + 2; // 2-3 shows per screen per day
      const selectedTimes = showTimes.slice(0, numShows);

      for (const time of selectedTimes) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const randomPrice = prices[Math.floor(Math.random() * prices.length)];

        const showTime = new Date(showDate);
        showTime.setHours(time.hour, time.minute, 0, 0);

        if (showTime > new Date()) {
          shows.push({
            movieId: randomMovie.id,
            screenId: screen.id,
            startTime: showTime,
            price: randomPrice,
          });
        }
      }
    }
  }

  await prisma.show.createMany({ data: shows });
  console.log(`✅ Created ${shows.length} shows\n`);

  console.log('🎉 Database seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log('═'.repeat(50));
  console.log(`   👥 Users: 3 (1 admin, 2 users)`);
  console.log(`   🎥 Movies: ${movies.length}`);
  console.log(`   🎬 Cinemas: 3`);
  console.log(`   📺 Screens: ${allScreens.length}`);
  console.log(`   🎪 Shows: ${shows.length}`);
  console.log('═'.repeat(50));
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin: admin@quickbook.com / password123');
  console.log('   User1: john@example.com / password123');
  console.log('   User2: jane@example.com / password123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
