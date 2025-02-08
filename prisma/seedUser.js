import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🗑 Deleting old users, vehicles, and locations...");
  await prisma.location.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Seeding Users...");

  const users = await prisma.user.createMany({
    data: [
      {
        email: "user1@example.com",
        password: "password123",
        phoneNumber: "1234567890",
        name: "John Doe",
        username: "johndoe",
        role: "CUSTOMER",
      },
      {
        email: "user2@example.com",
        password: "password123",
        phoneNumber: "9876543210",
        name: "Jane Smith",
        username: "janesmith",
        role: "CUSTOMER",
      },
      {
        email: "user3@example.com",
        password: "password123",
        phoneNumber: "5556667777",
        name: "Michael Brown",
        username: "michaelbrown",
        role: "CUSTOMER",
      },
      {
        email: "user4@example.com",
        password: "password123",
        phoneNumber: "3334445555",
        name: "Sarah Johnson",
        username: "sarahjohnson",
        role: "CUSTOMER",
      },
      {
        email: "user5@example.com",
        password: "password123",
        phoneNumber: "1112223333",
        name: "Robert Wilson",
        username: "robertwilson",
        role: "CUSTOMER",
      },
    ],
  });

  console.log("✅ Users seeded successfully.");

  // Fetch created users
  const createdUsers = await prisma.user.findMany();

  console.log("🚗 Seeding Vehicles...");
  const vehicleMakes = ["Toyota", "Honda", "Ford", "BMW", "Audi"];
  const vehicleModels = ["Corolla", "Civic", "Mustang", "X5", "A4"];
  const vehicleYears = [2015, 2017, 2018, 2020, 2022];

  for (const user of createdUsers) {
    await prisma.vehicle.create({
      data: {
        userId: user.id,
        make: vehicleMakes[Math.floor(Math.random() * vehicleMakes.length)],
        model: vehicleModels[Math.floor(Math.random() * vehicleModels.length)],
        year: vehicleYears[Math.floor(Math.random() * vehicleYears.length)],
      },
    });
  }

  console.log("✅ Vehicles seeded successfully.");

  console.log("📍 Seeding Locations...");
  for (const user of createdUsers) {
    await prisma.location.create({
      data: {
        userId: user.id,
        latitude: parseFloat((Math.random() * (50 - 25) + 25).toFixed(6)),
        longitude: parseFloat((Math.random() * (-125 - -75) + -75).toFixed(6)),
      },
    });
  }

  console.log("✅ Locations seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
