import { verifyToken } from "../../../../lib/auth"; // Import verifyToken function
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Get the garage ID from the query parameters

  if (req.method === "GET") {
    // Check for Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      console.log(decoded, "from garage api");

      // Fetch garage details by ID

    // Fetch garage details by ID, including subServices
    const garage = await prisma.serviceProvider.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        services: {
          include: {
            subServices: true, // Include subServices for each service
          },
        },
        reviews: {
          include: {
            user: true, // Fetch the user who left the review
          },
        },
      },
    });
      if (!garage) {
        return res.status(404).json({ error: "Garage not found" });
      }

      return res.status(200).json(garage);
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
      console.log(decoded, "from garage api");

      const { email, password, phoneNumber, businessName, ownerName, location, latitude, longitude } = req.body;

      // Update the garage details in the database
      const updatedGarage = await prisma.serviceProvider.update({
        where: {
          id: parseInt(id),
        },
        data: {
          email,
          password, // Ideally, hash the password before saving
          phoneNumber,
          businessName,
          ownerName,
          location,
          avatar,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      });

      return res.status(200).json(updatedGarage);
    } catch (tokenError) {
      console.error("Token verification error:", tokenError);
      return res.status(401).json({ error: "Invalid token or token expired" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
