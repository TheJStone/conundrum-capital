const { PrismaClient } = require('@prisma/client');
const { PUZZLE_SEED_DATA } = require('./puzzledata');

const prisma = new PrismaClient();

async function main() {
  // Purge all tables (order matters if there are FKs)
  const deleteResults = await prisma.$transaction([
    prisma.game.deleteMany({}),
    prisma.puzzleLevel.deleteMany({}),
    prisma.user.deleteMany({}),
  ]);
  console.log('Deleted counts:', {
    games: deleteResults[0].count,
    puzzleLevels: deleteResults[1].count,
    users: deleteResults[2].count,
  });

  // Create a test user
  await prisma.user.create({
    data: {
      id: '1',
      email: 'markandreason@example.com',
      username: 'markandreason',
    },
  });

  // Seed puzzles from PUZZLE_SEED_DATA
  for (const puzzle of PUZZLE_SEED_DATA) {
    await prisma.puzzleLevel.create({
      data: puzzle,
    });
  }

  console.log('Database seeded with test user and puzzles from puzzledata.ts.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
