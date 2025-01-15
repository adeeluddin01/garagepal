import { verifyToken } from "../../../../lib/auth"; // Token verification utility
import prisma from "../../../../lib/prisma"; // Prisma client

export default async function handler(req, res) {
  if (req.method === "POST") {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);

      const { serviceProviderId, name, description } = req.body;
        console.log(req.body)
      if (!serviceProviderId || !name || !description) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const newService = await prisma.service.create({
        data: {
          serviceProviderId:parseInt(serviceProviderId),
          name,
          description,
        },
      });

      return res.status(201).json(newService);
    } catch (error) {
      console.error("Error adding service:", error);
      return res.status(500).json({ error: "Failed to add service" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
