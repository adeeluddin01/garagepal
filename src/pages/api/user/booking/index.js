import prisma from "../../../../lib/prisma";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
    }

    const userId = decoded.id;

    if (req.method === "GET") {
      // Fetch all bookings for the logged-in user
      const bookings = await prisma.booking.findMany({
        where: { userId },
        include: {
          serviceProvider: { select: { id, name } },
          service: { select: { id, name } },
          employee: { select: { id, name } },
          payments: true,
        },
      });

      return res.status(200).json({ bookings });
    }

    if (req.method === "POST") {
      // Create a new booking
      const { serviceProviderId, serviceId, scheduledAt } = req.body;

      if (!serviceProviderId || !serviceId || !scheduledAt) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const newBooking = await prisma.booking.create({
        data: {
          userId,
          serviceProviderId,
          serviceId,
          scheduledAt: new Date(scheduledAt),
          status: "PENDING",
        },
      });

      return res.status(201).json({ message: "Booking created", booking: newBooking });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
