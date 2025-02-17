import prisma from "@/lib/prisma"; // Prisma client

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const booking = await prisma.customerBookingRequest.findUnique({
        where: { id: parseInt(id) },
        include: { customer: true, vehicle: true, service: true },
      });

      if (!booking) return res.status(404).json({ error: "Booking not found" });

      res.status(200).json(booking);
    } catch (error) {
      res.status(500).json({ error: "Error fetching booking" });
    }
  } else if (req.method === "PUT") {
    const { customerId, vehicleId, serviceId, status } = req.body;
    try {
      const updatedBooking = await prisma.customerBookingRequest.update({
        where: { id: parseInt(id) },
        data: { customerId, vehicleId, serviceId, status },
      });
      res.status(200).json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: "Error updating booking" });
    }
  } else if (req.method === "DELETE") {
    try {
      await prisma.customerBookingRequest.delete({ where: { id: parseInt(id) } });
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ error: "Error deleting booking" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
