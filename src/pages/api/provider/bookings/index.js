import { verifyToken } from "../../../../lib/auth"; // Import authentication function
import prisma from "../../../../lib/prisma"; // Import Prisma client

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  // Check for token in all requests
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
    console.log(decoded, "Decoded user from booking API");
  } catch (tokenError) {
    console.error("Token verification error:", tokenError);
    return res.status(401).json({ error: "Invalid token or token expired" });
  }



  if (req.method === "POST") {


    const { serviceProviderId, subServiceId, employeeId, scheduledAt, subServiceCost,vehicleId,customerId } = req.body;
    // Validate required fields
    if (!serviceProviderId || !subServiceId || !scheduledAt || !subServiceCost || !vehicleId || !customerId === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }


    try {
      const userId = decoded.id;
      console.log("Creating Booking:", { userId, serviceProviderId, subServiceId, employeeId, scheduledAt, customerId, subServiceCost, vehicleId });

      // ✅ First, create the Booking
      const newBooking = await prisma.booking.create({
        data: {
          userId,
          serviceProviderId,
          subServiceId,
          employeeId: employeeId ? parseInt(employeeId) : null,
          scheduledAt: new Date(scheduledAt),
          customerId,
          cost: subServiceCost,
          vehicleId: vehicleId || null,
        },
      });

      // Create the payment record for the booking
      const newPayment = await prisma.payment.create({
        data: {
          money: subServiceCost,
          bookingId: newBooking.id,
          description: "Payment for booking"+newBooking.id+"on"+subServiceCost
        },
      });

      return res.status(201).json({ booking: newBooking, payment: newPayment });
    } catch (dbError) {
      console.error("Database error while creating booking and payment:", dbError);
      return res.status(500).json({ error: "Failed to create booking and payment" });
    }
  }
  
  if (req.method === "GET") {
    let { page = 1, limit = 10 } = req.query;

    // Ensure valid pagination numbers
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    if (isNaN(page) || page < 1) page = 1;
    if (isNaN(limit) || limit < 1) limit = 10;
    try {
        const bookings = await prisma.booking.findMany({
            where: { userId: decoded.id }, // ✅ Fetch bookings for a specific customer
            include: {
              user: { select: { name: true } },
              subService: { select: { name: true } },
              customer: { select: { name: true } }

            }
          });
                  console.log("Bookings",bookings)
      // Count total bookings
      const totalBookings = await prisma.booking.count({
        where: { userId: decoded.id },
      });

      // Handle no bookings case
      if (!bookings || bookings.length === 0) {
        return res.status(200).json({ bookings: [], total: 0, message: "No bookings found" });
      }

      return res.status(200).json({ bookings, total: totalBookings });
    } catch (dbError) {
      console.error("Database error while fetching bookings:", dbError);
      return res.status(500).json({ error: "Failed to fetch bookings" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
