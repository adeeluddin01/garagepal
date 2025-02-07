import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create Demo Service Providers (Garages)
  await prisma.serviceProvider.createMany({
    data: [
      {
        email: "garage1@example.com",
        password: "securepassword1",
        phoneNumber: "1234567890",
        businessName: "Elite Auto Care",
        ownerName: "John Doe",
        location: "Downtown, LA",
        latitude: 34.0522,
        longitude: -118.2437,
      },
      {
        email: "garage2@example.com",
        password: "securepassword2",
        phoneNumber: "0987654321",
        businessName: "Speedy Garage",
        ownerName: "Jane Smith",
        location: "Uptown, NY",
        latitude: 40.7128,
        longitude: -74.0060,
      },
      {
        email: "garage3@example.com",
        password: "securepassword3",
        phoneNumber: "1122334455",
        businessName: "Precision Auto Works",
        ownerName: "Michael Johnson",
        location: "Chicago, IL",
        latitude: 41.8781,
        longitude: -87.6298,
      },
      {
        email: "garage4@example.com",
        password: "securepassword4",
        phoneNumber: "2233445566",
        businessName: "Grand Motors Repair",
        ownerName: "Emily Davis",
        location: "Houston, TX",
        latitude: 29.7604,
        longitude: -95.3698,
      },
      {
        email: "garage5@example.com",
        password: "securepassword5",
        phoneNumber: "3344556677",
        businessName: "ProTech Auto",
        ownerName: "Robert Wilson",
        location: "San Francisco, CA",
        latitude: 37.7749,
        longitude: -122.4194,
      },
      {
        email: "garage6@example.com",
        password: "securepassword6",
        phoneNumber: "4455667788",
        businessName: "QuickFix Car Service",
        ownerName: "Sophia Brown",
        location: "Miami, FL",
        latitude: 25.7617,
        longitude: -80.1918,
      },
    ],
  });

  console.log("Created 6 Service Providers...");

  // Fetch Created Garages
  const garageList = await prisma.serviceProvider.findMany();

  if (!garageList.length) {
    console.error("Error fetching garages.");
    return;
  }

  // Define Services and Sub-Services
  const servicesData = [
    {
      name: "General Auto Repair & Maintenance",
      description: "Comprehensive auto repair and maintenance services.",
      subServices: [
        "Engine diagnostics",
        "Fluid checks & top-ups",
        "Oil change",
        "Filter replacement",
        "Tune-ups",
        "Fuel system cleaning",
      ],
    },
    {
      name: "Tire Services",
      description: "Tire installation, repair, and maintenance.",
      subServices: [
        "Tire installation & replacement",
        "Tire balancing",
        "Tire rotation",
        "Wheel alignment",
      ],
    },
    {
      name: "Brake System Services",
      description: "Complete brake system inspection and repair.",
      subServices: [
        "Brake pad & rotor replacement",
        "Brake fluid flush",
        "ABS diagnostics & repair",
      ],
    },
    {
      name: "Battery & Electrical System",
      description: "Battery testing and electrical system diagnostics.",
      subServices: [
        "Battery testing & replacement",
        "Alternator replacement",
        "Starter motor repair",
      ],
    },
    {
      name: "Engine Services",
      description: "Engine repair and performance tuning.",
      subServices: [
        "Engine tuning & performance upgrades",
        "Head gasket replacement",
        "Timing belt/chain replacement",
      ],
    },
    {
      name: "Hybrid & EV Services",
      description: "Electric and hybrid vehicle maintenance.",
      subServices: [
        "High-voltage battery replacement",
        "Electric motor diagnostics & repair",
        "Charging system inspection",
      ],
    },
  ];

  // Insert Services and Sub-Services for Each Garage
  for (const garage of garageList) {
    for (const service of servicesData) {
      const createdService = await prisma.service.create({
        data: {
          name: service.name,
          description: service.description,
          serviceProviderId: garage.id,
        },
      });

      await prisma.subService.createMany({
        data: service.subServices.map((sub) => ({
          serviceId: createdService.id,
          name: sub,
        })),
      });

      console.log(`Added ${service.name} for ${garage.businessName}`);
    }
  }

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
