import { verifyToken } from "../../../../lib/auth"; // Token verification utility
import prisma from "../../../../lib/prisma"; // Prisma client

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  if (req.method === "GET") {
    // ✅ Fetch all services
    try {
      const services = await prisma.service.findMany();
      return res.status(200).json(services);
    } catch (error) {
      console.error("Error fetching services:", error);
      return res.status(500).json({ error: "Failed to retrieve services" });
    }
  }

  if (req.method === "POST") {
    // ✅ Create a new service
    try {
      const { serviceProviderId, name, description } = JSON.parse(req.body);

      if (!serviceProviderId || !name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newService = await prisma.service.create({
        data: {
          serviceProviderId: parseInt(serviceProviderId),
          name,
          description,
        },
      });

      return res.status(201).json(newService);
    } catch (error) {
      console.error("Error adding service:", error);
      return res.status(500).json({ error: "Failed to add service" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
