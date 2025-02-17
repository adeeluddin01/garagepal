import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const booking = await prisma.booking.findUnique({
        where: { id: parseInt(id) },
        include: {
          serviceProvider: true,
          user: true,
          service: true,
        },
      });

      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      return res.status(200).json(booking);
    } catch (error) {
      console.error("Error fetching booking:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "PUT") {
    try {
      const { status, confirmedTimeSlot } = req.body;

      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }

      const updatedBooking = await prisma.booking.update({
        where: { id: parseInt(id) },
        data: {
          status,
          confirmedTimeSlot: confirmedTimeSlot ? new Date(confirmedTimeSlot) : null,
        },
      });

      return res.status(200).json({ message: "Booking updated", booking: updatedBooking });
    } catch (error) {
      console.error("Error updating booking:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      await prisma.booking.delete({
        where: { id: parseInt(id) },
      });

      return res.status(200).json({ message: "Booking deleted successfully" });
    } catch (error) {
      console.error("Error deleting booking:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
