import { verifyToken } from "../../../../lib/auth"; // Import verifyToken function
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Authorization for adding a garage
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from garage API");

      const { email, password, phoneNumber, businessName, ownerName, location, latitude, longitude, description } = req.body;

      // Create a new garage (service provider)
      const newServiceProvider = await prisma.serviceProvider.create({
        data: {
          email,
          password, // Hash before saving in production
          phoneNumber,
          businessName,
          ownerName,
          location,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          description,
        },
      });
      

      return res.status(201).json(newServiceProvider);
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Database operation failed" });
    }
  }

  // ✅ Fetch all garages along with their services and sub-services
  else if (req.method === "GET") {
    try {
      const garages = await prisma.serviceProvider.findMany({
        include: {
          services: {
            include: {
              subServices: true, // ✅ Now includes sub-services
            },
          },
        },
      });

      return res.status(200).json(garages);
    } catch (error) {
      console.error("Error fetching garages:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  // ❌ Handle unsupported methods
  else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
