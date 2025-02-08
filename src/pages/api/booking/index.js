import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const bookings = await prisma.booking.findMany({
        include: {
          serviceProvider: true,
          user: true,
          service: true,
        },
      });
      return res.status(200).json(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { userId, serviceProviderId, serviceId, preferredTimeSlot } = req.body;

      if (!userId || !serviceProviderId || !serviceId || !preferredTimeSlot) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newBooking = await prisma.booking.create({
        data: {
          userId: parseInt(userId),
          serviceProviderId: parseInt(serviceProviderId),
          serviceId: parseInt(serviceId),
          preferredTimeSlot: new Date(preferredTimeSlot),
          status: "PENDING",
        },
      });

      return res.status(201).json({ message: "Booking request sent", booking: newBooking });
    } catch (error) {
      console.error("Error creating booking:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
