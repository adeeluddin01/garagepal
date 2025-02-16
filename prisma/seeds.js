import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Clearing database...");

  await prisma.payment.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.vehicle.deleteMany({});
  await prisma.subService.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceProvider.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.employee.deleteMany({});
  await prisma.availability.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.message.deleteMany({});
  await prisma.location.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared!");

  console.log("Seeding database...");

  // 1️⃣ Create Users (Customers & Service Providers)
  const createdUsers = await prisma.user.createMany({
    data: [
      { email: "customer1@example.com", password: "$2b$10$ifPdOiyLIXk6OTr3qnT9uOpdVeKKTk1lfd1/RcGrU1LtsQYfdQWo2", phoneNumber: "1111111111", name: "Alice Johnson", role: "CUSTOMER", username: "alicej" },
      { email: "customer2@example.com", password: "$2b$10$ifPdOiyLIXk6OTr3qnT9uOpdVeKKTk1lfd1/RcGrU1LtsQYfdQWo2", phoneNumber: "2222222222", name: "Bob Smith", role: "CUSTOMER", username: "bobsmith" },
      { email: "provider1@example.com", password: "$2b$10$ifPdOiyLIXk6OTr3qnT9uOpdVeKKTk1lfd1/RcGrU1LtsQYfdQWo2", phoneNumber: "3333333333", name: "Elite Garage", role: "SERVICE_PROVIDER", username: "elitegarage" },
      { email: "provider2@example.com", password: "$2b$10$ifPdOiyLIXk6OTr3qnT9uOpdVeKKTk1lfd1/RcGrU1LtsQYfdQWo2", phoneNumber: "4444444444", name: "Speedy Auto", role: "SERVICE_PROVIDER", username: "speedyauto" },
    ],
  });

  console.log("Created Users...");

  const users = await prisma.user.findMany();
  const serviceProviderUsers = users.filter((user) => user.role === "SERVICE_PROVIDER");

  // 2️⃣ Create Service Providers
  const createdGarages = await prisma.serviceProvider.createMany({
    data: serviceProviderUsers.map((user, index) => ({
      email: user.email,
      password: user.password,
      phoneNumber: user.phoneNumber,
      businessName: index === 0 ? "Elite Auto Care" : "Speedy Garage",
      ownerName: user.name,
      userId: user.id,
      location: index === 0 ? "Los Angeles, CA" : "New York, NY",
      latitude: index === 0 ? 34.0522 : 40.7128,
      longitude: index === 0 ? -118.2437 : -74.0060,
    })),
  });

  console.log("Created Service Providers...");

  const garages = await prisma.serviceProvider.findMany();

  // 3️⃣ Create Services and Sub-Services
  const servicesData = [
    { name: "General Auto Repair", description: "Complete auto repair.", subServices: ["Oil Change", "Brake Inspection", "Battery Check"] },
    { name: "Tire Services", description: "Tire installation & maintenance.", subServices: ["Tire Rotation", "Wheel Alignment", "Tire Balancing"] },
    { name: "Engine Services", description: "Engine diagnostics & repair.", subServices: ["Engine Diagnostics", "Timing Belt Replacement", "Fuel System Cleaning"] },
  ];

  for (const garage of garages) {
    for (const service of servicesData) {
      const createdService = await prisma.service.create({
        data: { name: service.name, description: service.description, serviceProviderId: garage.id },
      });

      await prisma.subService.createMany({
        data: service.subServices.map((sub) => ({
          serviceId: createdService.id,
          name: sub,
          cost: 20,
          description: `${sub} service`,
        })),
      });

      console.log(`Added ${service.name} for ${garage.businessName}`);
    }
  }

  // 4️⃣ Create Locations
  const customers = users.filter((user) => user.role === "CUSTOMER");

  await prisma.location.createMany({
    data: customers.map((customer, index) => ({
      userId: customer.id,
      latitude: index === 0 ? 34.0522 : 40.7128,
      longitude: index === 0 ? -118.2437 : -74.0060,
    })),
  });

  console.log("Created Locations...");

  // 5️⃣ Create Vehicles
  await prisma.vehicle.createMany({
    data: customers.map((customer, index) => ({
      userId: customer.id,
      vehicleNo: `ABC-${index + 1}234`,
      vin: `VIN000${index + 1}`,
      make: index === 0 ? "Toyota" : "Honda",
      model: index === 0 ? "Camry" : "Civic",
      year: index === 0 ? 2020 : 2019,
      pic: "https://example.com/vehicle.jpg",
    })),
  });

  console.log("Created Vehicles...");

  // 6️⃣ Create Reviews
  await prisma.review.createMany({
    data: [
      { userId: customers[0].id, serviceProviderId: garages[0].id, rating: 4.5, comment: "Great service!" },
      { userId: customers[1].id, serviceProviderId: garages[1].id, rating: 4.0, comment: "Very professional." },
    ],
  });

  console.log("Created Reviews...");

  // 7️⃣ Create Employees
  for (const garage of garages) {
    await prisma.employee.create({
      data: {
        name: `Mechanic ${garage.businessName}`,
        serviceProviderId: garage.id,
      },
    });
  }

  console.log("Created Employees...");

  // 8️⃣ Create Service Provider Availability
  await prisma.availability.createMany({
    data: garages.map((garage) => ({
      serviceProviderId: garage.id,
      day: "Monday",
      startTime: new Date(),
      endTime: new Date(),
    })),
  });

  console.log("Created Service Provider Availability...");

  // 9️⃣ Create Bookings
  const subServices = await prisma.subService.findMany();
  const vehicles = await prisma.vehicle.findMany();

  await prisma.booking.createMany({
    data: [
      { userId: customers[0].id, serviceProviderId: garages[0].id, subServiceId: subServices[0].id, vehicleId: vehicles[0].id, status: "CONFIRMED", scheduledAt: new Date(), cost: 100 },
      { userId: customers[1].id, serviceProviderId: garages[1].id, subServiceId: subServices[3].id, vehicleId: vehicles[1].id, status: "PENDING", scheduledAt: new Date(), cost: 80 },
    ],
  });

  console.log("Created Bookings...");

  // 🔟 Create Payments
  const bookings = await prisma.booking.findMany();

  await prisma.payment.createMany({
    data: bookings.map((booking) => ({
      bookingId: booking.id,
      money: booking.cost ?? 0,
      description: "Service Payment",
      status: "COMPLETED",
    })),
  });

  console.log("Created Payments...");

  // 1️⃣1️⃣ Create Notifications
  await prisma.notification.createMany({
    data: customers.map((customer) => ({
      userId: customer.id,
      message: "Your booking has been confirmed!",
    })),
  });

  console.log("Created Notifications...");

  // 1️⃣2️⃣ Create Messages
  // await prisma.message.createMany({
  //   data: [
  //     { senderId: customers[0].id, receiverId: garages[0].id, content: "Hello, I need a service." },
  //     { senderId: garages[0].id, receiverId: customers[0].id, content: "Sure, we are available!" },
  //   ],
  // });

  // console.log("Created Messages...");

  console.log("Seeding Completed!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
