import { verifyToken } from "../../../../lib/auth"; // Token verification utility
import prisma from "../../../../lib/prisma"; // Prisma client

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

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
  const reqbody = JSON.parse(req.body)
  const serviceProviderId = reqbody.serviceProviderId;
  const name = reqbody.name;
  const description = reqbody.description;
    console.log(serviceProviderId, name, description)
  if (!serviceProviderId || !name || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
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
