import { PrismaClient, Role, BookingStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create Users
  const user1 = await prisma.user.create({
    data: {
      email: 'customer@example.com',
      password: 'admin123',
      phoneNumber: '12345678900',
      name: 'Customer One',
      role: Role.CUSTOMER,
      username: 'customer1',
    },
  });

  const serviceProvider = await prisma.serviceProvider.create({
    data: {
      email: 'serviceprovider@example.com',
      password: 'admin123',
      phoneNumber: '0987654321',
      businessName: 'Garage Services',
      ownerName: 'John Doe',
      location: '123 Garage St.',
      latitude: 12.345,
      longitude: 67.890,
    },
  });

  // Create Vehicle for user1
  const vehicle = await prisma.vehicle.create({
    data: {
      userId: user1.id,
      make: 'Toyota',
      model: 'Corolla',
      year: 2020,
    },
  });

  // Create a Service for ServiceProvider
  const service = await prisma.service.create({
    data: {
      serviceProviderId: serviceProvider.id,
      name: 'Tire Service',
      description: 'Full tire replacement and repair',
    },
  });

  // Create SubService
  const subService = await prisma.subService.create({
    data: {
      serviceId: service.id,
      name: 'Tire Replacement',
    },
  });

  // Create a Booking for User1
  const booking = await prisma.booking.create({
    data: {
      userId: user1.id,
      serviceProviderId: serviceProvider.id,
      serviceId: service.id,
      status: BookingStatus.PENDING,
      scheduledAt: new Date('2025-02-15T10:00:00Z'),
    },
  });

  // Create Payment for Booking
  const payment = await prisma.payment.create({
    data: {
      bookingId: booking.id,
      status: PaymentStatus.PENDING,
    },
  });

  // Create a Review for Service
  const review = await prisma.review.create({
    data: {
      userId: user1.id,
      serviceProviderId: serviceProvider.id,
      rating: 4.5,
      comment: 'Great service! Tire replacement was quick and smooth.',
    },
  });

  // Create Notification for User
  const notification = await prisma.notification.create({
    data: {
      userId: user1.id,
      message: 'Your booking is confirmed!',
    },
  });

  // Create Availability for ServiceProvider
  const availability = await prisma.availability.create({
    data: {
      serviceProviderId: serviceProvider.id,
      day: 'Monday',
      startTime: new Date('2025-02-16T09:00:00Z'),
      endTime: new Date('2025-02-16T17:00:00Z'),
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
