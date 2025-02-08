import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🗑 Deleting old bookings...");
  await prisma.booking.deleteMany({});

  console.log("🔍 Fetching existing garages, users, and services...");
  const garages = await prisma.serviceProvider.findMany();
  const users = await prisma.user.findMany();
  const services = await prisma.service.findMany();

  if (garages.length === 0 || users.length === 0 || services.length === 0) {
    console.error("❌ Cannot seed bookings. Please seed Garages, Users, and Services first.");
    return;
  }

  console.log("🌱 Seeding Bookings...");

  const seedData = [];

  // Create 10 bookings distributed among garages
  for (let i = 0; i < 10; i++) {
    const randomGarage = garages[Math.floor(Math.random() * garages.length)];
    const randomUser = users[Math.floor(Math.random() * users.length)];
    const randomService = services.find(s => s.serviceProviderId === randomGarage.id);

    if (!randomService) continue; // Skip if no matching service

    seedData.push({
      userId: randomUser.id,
      serviceProviderId: randomGarage.id,
      serviceId: randomService.id,
      preferredTimeSlot: new Date(`2024-02-${10 + i}T10:00:00.000Z`),
      status: "PENDING",
    });
  }

  await prisma.booking.createMany({ data: seedData });

  console.log("✅ Bookings seeded successfully.");
}

main()
  .catch((e) => {
    console.error("❌ Error during booking seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
