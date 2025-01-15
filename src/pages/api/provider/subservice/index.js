import { verifyToken } from "../../../../lib/auth"; // Import the verifyToken function
import prisma from "../../../../lib/prisma"; // Import Prisma client

export default async function handler(req, res) {
  if (req.method === "POST") {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);

      // Extract data from the request body
      const { serviceId, name, description } = req.body;

      if (!serviceId || !name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Add the sub-service to the database
      const newSubService = await prisma.subService.create({
        data: {
          name,
          description,
          service: {
            connect: {
              id: serviceId,
            },
          },
        },
      });

      return res.status(201).json(newSubService);
    } catch (error) {
      console.error("Error adding sub-service:", error);
      return res.status(500).json({ error: "Failed to add sub-service" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
