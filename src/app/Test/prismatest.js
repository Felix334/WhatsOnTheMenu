const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();
   
async function main() {
  // Create a new user
  const newUser  = await prisma.user.create({
    data: {
      name: 'Alice',
      email: 'alice@example.com',
    },
  });
  console.log('Created User:', newUser );
  // Retrieve all users
  const allUsers = await prisma.user.findMany();
  console.log('All Users:', allUsers);
}
// Execute the main function
main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });