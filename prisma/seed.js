import { PrismaClient, Role, BookingStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Upsert Users
  const customer1 = await prisma.user.upsert({
    where: { phoneNumber: '12345678900' },
    update: {},
    create: {
      email: 'customer1@example.com',
      password: 'securepassword123',
      phoneNumber: '12345678900',
      name: 'Customer One',
      role: Role.CUSTOMER,
      username: 'customer1',
    },
  });

  const customer2 = await prisma.user.upsert({
    where: { phoneNumber: '22345678900' },
    update: {},
    create: {
      email: 'customer2@example.com',
      password: 'securepassword123',
      phoneNumber: '22345678900',
      name: 'Customer Two',
      role: Role.CUSTOMER,
      username: 'customer2',
    },
  });

  const admin = await prisma.user.upsert({
    where: { phoneNumber: '99999999999' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: 'securepassword123',
      phoneNumber: '99999999999',
      name: 'Admin User',
      role: Role.ADMIN,
      username: 'admin',
    },
  });

  console.log("Users seeded successfully.");

  // Upsert Service Providers (Garages)
  const garage1 = await prisma.serviceProvider.upsert({
    where: { email: 'garage1@example.com' },
    update: {},
    create: {
      email: 'garage1@example.com',
      password: 'securepassword123',
      phoneNumber: '0987654321',
      businessName: 'FastFix Garage',
      ownerName: 'John Doe',
      userId: admin.id,
      location: '123 Auto Street',
      latitude: 12.345,
      longitude: 67.890,
    },
  });

  const garage2 = await prisma.serviceProvider.upsert({
    where: { email: 'garage2@example.com' },
    update: {},
    create: {
      email: 'garage2@example.com',
      password: 'securepassword123',
      phoneNumber: '1987654321',
      businessName: 'Speedy Repairs',
      ownerName: 'Jane Smith',
      userId: admin.id,
      location: '456 Motor Ave',
      latitude: 13.456,
      longitude: 68.901,
    },
  });

  console.log("Garages seeded successfully.");

  // Upsert Employees
  const employee1 = await prisma.employee.upsert({
    where: { id: 1 },
    update: {},
    create: { name: 'Mike Johnson', serviceProviderId: garage1.id },
  });

  const employee2 = await prisma.employee.upsert({
    where: { id: 2 },
    update: {},
    create: { name: 'Sarah Adams', serviceProviderId: garage2.id },
  });

  console.log("Employees seeded successfully.");

  // Upsert Vehicles (Fix: Use `id` in `where` instead of `vehicleNo`)
  const vehicle1 = await prisma.vehicle.upsert({
    where: { id: 1 }, // Use `id` instead of `vehicleNo`
    update: {},
    create: {
      userId: customer1.id,
      vehicleNo: 'ABC-1234',
      vin: '1HGBH41JXMN109186',
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
      pic: 'toyota_corolla.jpg',
    },
  });

  const vehicle2 = await prisma.vehicle.upsert({
    where: { id: 2 }, // Use `id` instead of `vehicleNo`
    update: {},
    create: {
      userId: customer2.id,
      vehicleNo: 'XYZ-5678',
      vin: '2HGBH41JXMN109186',
      make: 'Honda',
      model: 'Civic',
      year: 2021,
      pic: 'honda_civic.jpg',
    },
  });

  console.log("Vehicles seeded successfully.");

  // Upsert Services & SubServices
  const service1 = await prisma.service.upsert({
    where: { id: 1 },
    update: {},
    create: {
      serviceProviderId: garage1.id,
      name: 'Oil Change',
      description: 'Comprehensive engine oil change service',
    },
  });

  const service2 = await prisma.service.upsert({
    where: { id: 2 },
    update: {},
    create: {
      serviceProviderId: garage2.id,
      name: 'Brake Service',
      description: 'Brake pad replacement and maintenance',
    },
  });

  const subService1 = await prisma.subService.upsert({
    where: { id: 1 },
    update: {},
    create: { serviceId: service1.id, name: 'Synthetic Oil Change', cost: 50 },
  });

  const subService2 = await prisma.subService.upsert({
    where: { id: 2 },
    update: {},
    create: { serviceId: service2.id, name: 'Brake Pad Replacement', cost: 100 },
  });

  console.log("Services & SubServices seeded successfully.");

  // Upsert Bookings
  const booking1 = await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: customer1.id,
      serviceProviderId: garage1.id,
      subServiceId: subService1.id,
      employeeId: employee1.id,
      vehicleId: vehicle1.id,
      status: BookingStatus.PENDING,
      scheduledAt: new Date('2025-02-15T10:00:00Z'),
      cost: 50,
    },
  });

  const booking2 = await prisma.booking.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: customer2.id,
      serviceProviderId: garage2.id,
      subServiceId: subService2.id,
      employeeId: employee2.id,
      vehicleId: vehicle2.id,
      status: BookingStatus.CONFIRMED,
      scheduledAt: new Date('2025-02-16T11:30:00Z'),
      cost: 100,
    },
  });

  console.log("Bookings seeded successfully.");

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
