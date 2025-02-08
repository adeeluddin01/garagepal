import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("🗑 Deleting old data...");
  await prisma.booking.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.serviceProvider.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("🌱 Seeding Garages and Services...");

  const garages = await prisma.serviceProvider.createMany({
    data: [
      {
        email: "eliteauto@example.com",
        password: "securepassword",
        phoneNumber: "123-456-7890",
        businessName: "Elite Auto Repair",
        ownerName: "John Doe",
        location: "123 Main Street, New York, NY",
        latitude: 40.7128,
        longitude: -74.006,
        description: "High-quality auto repair and maintenance services with experienced technicians.",
      },
      {
        email: "speedymechanic@example.com",
        password: "securepassword",
        phoneNumber: "987-654-3210",
        businessName: "Speedy Mechanic",
        ownerName: "Jane Smith",
        location: "456 Elm Street, Los Angeles, CA",
        latitude: 34.0522,
        longitude: -118.2437,
        description: "Fast and reliable car services, including engine diagnostics and brake repairs.",
      },
      {
        email: "profixautos@example.com",
        password: "securepassword",
        phoneNumber: "456-789-1234",
        businessName: "ProFix Auto Solutions",
        ownerName: "Michael Brown",
        location: "789 Pine Avenue, San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
        description: "Expert auto repairs and diagnostics with a commitment to quality service.",
      },
      {
        email: "autodrive@example.com",
        password: "securepassword",
        phoneNumber: "789-123-4567",
        businessName: "AutoDrive Repair Hub",
        ownerName: "Sarah Johnson",
        location: "321 Cedar Road, Miami, FL",
        latitude: 25.7617,
        longitude: -80.1918,
        description: "Affordable and efficient car servicing with a focus on customer satisfaction.",
      },
      {
        email: "fixitfast@example.com",
        password: "securepassword",
        phoneNumber: "321-654-9870",
        businessName: "Fix It Fast Garage",
        ownerName: "Robert Wilson",
        location: "654 Maple Drive, Chicago, IL",
        latitude: 41.8781,
        longitude: -87.6298,
        description: "Quick and professional vehicle maintenance for all makes and models.",
      },
      {
        email: "premiumwheels@example.com",
        password: "securepassword",
        phoneNumber: "159-753-8524",
        businessName: "Premium Wheels Auto Care",
        ownerName: "Emily Davis",
        location: "951 Spruce Lane, Houston, TX",
        latitude: 29.7604,
        longitude: -95.3698,
        description: "Specialized in tire services, oil changes, and advanced vehicle inspections.",
      },
      {
        email: "urbanmechanics@example.com",
        password: "securepassword",
        phoneNumber: "852-456-7891",
        businessName: "Urban Mechanics",
        ownerName: "Daniel Lee",
        location: "753 Birch Avenue, Seattle, WA",
        latitude: 47.6062,
        longitude: -122.3321,
        description: "Top-tier mechanics for hybrid and luxury vehicles, providing expert services.",
      },
      {
        email: "quickfixauto@example.com",
        password: "securepassword",
        phoneNumber: "741-258-3690",
        businessName: "Quick Fix Auto Works",
        ownerName: "Sophia Martin",
        location: "369 Redwood Blvd, Phoenix, AZ",
        latitude: 33.4484,
        longitude: -112.074,
        description: "On-the-go repairs and maintenance services tailored to your needs.",
      },
    ],
  });

  console.log("✅ Garages seeded successfully.");

  const createdGarages = await prisma.serviceProvider.findMany();

  console.log("🌱 Seeding Services for Each Garage...");

  for (const garage of createdGarages) {
    const services = await prisma.service.createMany({
      data: [
        {
          name: "General Auto Repair & Maintenance",
          description: "Routine maintenance, inspections, and repairs for all vehicle types.",
          price: 80,
          serviceProviderId: garage.id,
        },
        {
          name: "Tire Services",
          description: "Tire rotation, balancing, replacements, and alignments.",
          price: 50,
          serviceProviderId: garage.id,
        },
        {
          name: "Brake System Repairs",
          description: "Brake pad replacements, rotor repairs, and hydraulic brake fixes.",
          price: 100,
          serviceProviderId: garage.id,
        },
        {
          name: "Engine Diagnostics",
          description: "Check engine light diagnostics and in-depth vehicle analysis.",
          price: 120,
          serviceProviderId: garage.id,
        },
        {
          name: "Transmission Repairs",
          description: "Transmission fluid changes, leak fixes, and clutch repairs.",
          price: 200,
          serviceProviderId: garage.id,
        },
      ],
    });

    const createdServices = await prisma.service.findMany({
      where: { serviceProviderId: garage.id },
    });

    console.log(`✅ Services seeded for ${garage.businessName}.`);

    console.log("🌱 Seeding Sub-Services...");

    for (const service of createdServices) {
      await prisma.service.createMany({
        data: [
          {
            name: "Oil Change",
            description: "Changing engine oil for smoother performance.",
            price: 30,
            serviceProviderId: service.serviceProviderId,
          },
          {
            name: "Tire Alignment",
            description: "Adjusting the wheels for optimal driving conditions.",
            price: 40,
            serviceProviderId: service.serviceProviderId,
          },
          {
            name: "Brake Pad Replacement",
            description: "Replacing worn-out brake pads for better stopping power.",
            price: 70,
            serviceProviderId: service.serviceProviderId,
          },
          {
            name: "Suspension Check",
            description: "Inspection and repair of suspension components.",
            price: 90,
            serviceProviderId: service.serviceProviderId,
          },
          {
            name: "Transmission Fluid Change",
            description: "Replacing old transmission fluid for smoother gear shifts.",
            price: 100,
            serviceProviderId: service.serviceProviderId,
          },
        ],
      });
    }

    console.log(`✅ Sub-Services seeded for ${garage.businessName}.`);
  }

  console.log("🎉 Seeding process completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
