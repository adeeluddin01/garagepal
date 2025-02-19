import { verifyToken } from "../../../../lib/auth"; // Import verifyToken function
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Get the booking ID from the query parameters

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  if (req.method === "GET") {
    // Check for Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from booking API");

      // Fetch booking details by ID
      const booking = await prisma.booking.findUnique({
        where: {
          id: parseInt(id),
        },
        include: {
            user: { select: { name: true } },
            serviceProvider: { select: { name: true } },

            subService: { select: { name: true } },
            customer: {
                include: {
                  vehicles: true, // ✅ Include customer vehicles
                },
              },
              employee: {
                include: {
                  name: true, // ✅ Include customer vehicles
                },
              },
          }
      });
      console.log(booking)
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      return res.status(200).json(booking);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token or token expired" });
    }
  } else if (req.method === "PUT") {
    // Check for Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from booking API");

      const { status, scheduledAt,subServiceId } = req.body;
        console.log(req.body)
      // Update the booking details in the database
      const updatedBooking = await prisma.booking.update({
        where: {
          id: parseInt(id),
        },
        data: {
          status, // Example: "Pending", "Completed", "Cancelled"
          scheduledAt: new Date(scheduledAt),
          subServiceId,
        },
      });
      console.log(updatedBooking)
      return res.status(200).json(updatedBooking);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token or token expired" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
