import prisma from "../../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Get the garage ID from the query parameters

  if (req.method === "GET") {
    try {
      // Fetch booked slots using serviceProviderId instead of garageId
      const bookedSlots = await prisma.booking.findMany({
        where: { serviceProviderId: parseInt(id) }, // ✅ Fix
        select: { preferredTimeSlot: true, confirmedTimeSlot: true },
      });

      return res.status(200).json(bookedSlots);
    } catch (error) {
      console.error("Error fetching booked slots:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
