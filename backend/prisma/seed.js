const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log('Clearing existing data...');
  await prisma.seatHold.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.show.deleteMany();
  await prisma.screen.deleteMany();
  await prisma.cinema.deleteMany();
  await prisma.movie.deleteMany();
  await prisma.user.deleteMany();

  // Create sample movies
  console.log('Creating movies...');
  const movies = await Promise.all([
    prisma.movie.create({
      data: {
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
    }),
    prisma.movie.create({
      data: {
        title: 'The Dark Knight',
        description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
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
    }),
    prisma.movie.create({
      data: {
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
        cast: 'Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine',
        certificate: 'U/A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Avengers: Endgame',
        description: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
        durationMin: 181,
        posterUrl: 'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
        genre: 'Action, Adventure, Sci-Fi',
        language: 'English',
        rating: '8.4',
        releaseDate: new Date('2019-04-26'),
        director: 'Anthony Russo, Joe Russo',
        cast: 'Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth, Scarlett Johansson',
        certificate: 'U/A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Parasite',
        description: 'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
        durationMin: 132,
        posterUrl: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=5xH0HfJHsaY',
        genre: 'Comedy, Drama, Thriller',
        language: 'Korean',
        rating: '8.6',
        releaseDate: new Date('2019-05-30'),
        director: 'Bong Joon Ho',
        cast: 'Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik',
        certificate: 'A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Joker',
        description: 'In Gotham City, mentally troubled comedian Arthur Fleck is disregarded and mistreated by society. He then embarks on a downward spiral of revolution and bloody crime.',
        durationMin: 122,
        posterUrl: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/n6bUvigpRFqSwmPp1m2YADdbRBc.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=zAGVQLHvwOY',
        genre: 'Crime, Drama, Thriller',
        language: 'English',
        rating: '8.4',
        releaseDate: new Date('2019-10-04'),
        director: 'Todd Phillips',
        cast: 'Joaquin Phoenix, Robert De Niro, Zazie Beetz, Frances Conroy',
        certificate: 'A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'The Shawshank Redemption',
        description: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
        durationMin: 142,
        posterUrl: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=6hB3S9bIaco',
        genre: 'Drama',
        language: 'English',
        rating: '9.3',
        releaseDate: new Date('1994-09-23'),
        director: 'Frank Darabont',
        cast: 'Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler',
        certificate: 'A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Pulp Fiction',
        description: 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.',
        durationMin: 154,
        posterUrl: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=s7EdQ4FqbhY',
        genre: 'Crime, Drama',
        language: 'English',
        rating: '8.9',
        releaseDate: new Date('1994-10-14'),
        director: 'Quentin Tarantino',
        cast: 'John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis',
        certificate: 'A',
      },
    }),
    prisma.movie.create({
      data: {
        title: 'Dune: Part Two',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        durationMin: 166,
        posterUrl: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        bannerUrl: 'https://image.tmdb.org/t/p/original/xOMo8BRK7PfcJv9JCnx7s5hj0PX.jpg',
        trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
        genre: 'Action, Adventure, Sci-Fi',
        language: 'English',
        rating: '8.8',
        releaseDate: new Date('2024-03-01'),
        director: 'Denis Villeneuve',
        cast: 'Timothée Chalamet, Zendaya, Rebecca Ferguson, Austin Butler',
        certificate: 'U/A',
      },
    }),
    prisma.movie.create({
      data: {
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
    }),
  ]);
  console.log(`✅ Created ${movies.length} movies`);

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
          { name: 'Screen 3' },
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
          { name: 'Audi 3' },
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
          { name: '4DX Screen' },
        ],
      },
    },
    include: { screens: true },
  });

  const cinema4 = await prisma.cinema.create({
    data: {
      name: 'Carnival Cinemas',
      city: 'Pune',
      screens: {
        create: [
          { name: 'Hall 1' },
          { name: 'Hall 2' },
        ],
      },
    },
    include: { screens: true },
  });

  const allScreens = [
    ...cinema1.screens,
    ...cinema2.screens,
    ...cinema3.screens,
    ...cinema4.screens,
  ];
  console.log(`✅ Created 4 cinemas with ${allScreens.length} screens`);

  // Create shows for the next 7 days
  console.log('Creating shows...');
  const shows = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const showTimes = [
    { hour: 10, minute: 0 },
    { hour: 13, minute: 30 },
    { hour: 16, minute: 45 },
    { hour: 20, minute: 15 },
    { hour: 22, minute: 30 },
  ];

  const prices = [150, 200, 250, 300, 350, 400];

  // Create shows for next 7 days
  for (let day = 0; day < 7; day++) {
    const showDate = new Date(today);
    showDate.setDate(today.getDate() + day);

    // Randomly assign movies to screens with different show times
    for (const screen of allScreens) {
      // Each screen gets 3-4 shows per day
      const numShows = Math.floor(Math.random() * 2) + 3; // 3 or 4 shows
      const selectedTimes = showTimes
        .sort(() => Math.random() - 0.5)
        .slice(0, numShows);

      for (const time of selectedTimes) {
        const randomMovie = movies[Math.floor(Math.random() * movies.length)];
        const randomPrice = prices[Math.floor(Math.random() * prices.length)];

        const showTime = new Date(showDate);
        showTime.setHours(time.hour, time.minute, 0, 0);

        // Only create shows for future times
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

  // Batch create all shows
  await prisma.show.createMany({
    data: shows,
  });
  console.log(`✅ Created ${shows.length} shows`);

  // Create sample users (including an admin)
  console.log('Creating sample users...');
  const bcrypt = require('bcryptjs');
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

  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
        phone: '+919876543211',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
        phone: '+919876543212',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Mike Johnson',
        email: 'mike@example.com',
        password: hashedPassword,
        phone: '+919876543213',
        role: 'USER',
      },
    }),
  ]);
  console.log(`✅ Created ${users.length + 1} users (1 admin, ${users.length} regular users)`);

  console.log('\n🎉 Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Movies: ${movies.length}`);
  console.log(`   - Cinemas: 4`);
  console.log(`   - Screens: ${allScreens.length}`);
  console.log(`   - Shows: ${shows.length}`);
  console.log(`   - Users: ${users.length + 1} (including 1 admin)`);
  console.log('\n🔐 Login Credentials:');
  console.log('   Admin:');
  console.log('   - Email: admin@quickbook.com');
  console.log('   - Password: password123');
  console.log('\n   Regular Users:');
  console.log('   - Email: john@example.com | Password: password123');
  console.log('   - Email: jane@example.com | Password: password123');
  console.log('   - Email: mike@example.com | Password: password123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
