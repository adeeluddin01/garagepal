import { verifyToken } from "../../../../lib/auth"; // Import verifyToken function
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Check for Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token, "from garage api");
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Separate the token verification into its own try-catch block
    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from garage api");

      // After successful token verification, proceed with the database operation
      const { email, password, phoneNumber, businessName, ownerName, location, latitude, longitude } = req.body;

      try {
        // Create a new service provider (garage)
        const newServiceProvider = await prisma.serviceProvider.create({
          data: {
            email,
            password, // Ideally, hash the password before saving
            phoneNumber,
            businessName,
            ownerName,
            userId:decoded.id,
            location,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
          },
        });

        return res.status(201).json(newServiceProvider);
      } catch (dbError) {
        console.error("Database error:", dbError);
        return res.status(500).json({ error: "Database operation failed" });
      }

    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token or token expired" });
    }
  }

  // Handle GET request to fetch all service providers (garages)
  else if (req.method === "GET") {
    // Optional: Check for the Authorization header if you want to validate token before fetching garages
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from garage api");

      // Fetch all garages (service providers) from the database
      const garages = await prisma.serviceProvider.findMany({
        where: {
          userId: decoded.id, // Only fetch garages where userId matches decoded token's id
        },
        select: {
          id: true,
          email: true,
          businessName: true,
          ownerName: true,
          location: true,
          latitude: true,
          longitude: true,
          createdAt: true,
          employees: true,

          services: {
            select: {
              id: true,
              name: true,
              description: true,
              subServices: {
                select: {
                  id: true,
                  name: true,
                  cost: true,

                },
              },
            },
          },
        },
      });
      

      // Return the list of garages
      return res.status(200).json(garages);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token or token expired" });
    }
  }

  // Handle unsupported methods
  else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
