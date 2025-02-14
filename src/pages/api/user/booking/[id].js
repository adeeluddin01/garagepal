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
    const { id } = req.query;
    const bookingId = parseInt(id);

    if (req.method === "GET") {
      // Fetch a single booking by ID
      const booking = await prisma.booking.findUnique({
        where: { id: bookingId, userId },
        include: {
          serviceProvider: { select: { id, name } },
          service: { select: { id, name } },
          employee: { select: { id, name } },
          payments: true,
        },
      });

      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      return res.status(200).json({ booking });
    }

    if (req.method === "PUT") {
      // Update booking status
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({ message: "Missing status" });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: bookingId, userId },
        data: { status },
      });

      return res.status(200).json({ message: "Booking updated", booking: updatedBooking });
    }

    if (req.method === "DELETE") {
      // Delete a booking
      await prisma.booking.delete({ where: { id: bookingId, userId } });

      return res.status(200).json({ message: "Booking deleted successfully" });
    }

    return res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
