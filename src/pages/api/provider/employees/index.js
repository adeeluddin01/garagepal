import { verifyToken } from "../../../../lib/auth"; // Import token verification
import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = verifyToken(token);

    if (req.method === "GET") {
      try {
        if (!decoded || !decoded.id) {
          return res.status(401).json({ error: "Unauthorized" });
        }

        const serviceProviders = await prisma.serviceProvider.findMany({
          where: { userId: decoded.id },
          select: { id: true },
        });

        const serviceProviderIds = serviceProviders.map(sp => sp.id);

        const employees = await prisma.employee.findMany({
          where: { serviceProviderId: { in: serviceProviderIds } },
          select: {
            id: true,
            name: true,
            ssn: true,
            address: true,
            pic: true,
            serviceProvider: { select: { businessName: true } },
          },
        });

        return res.status(200).json(employees);
      } catch (error) {
        console.error("Error fetching employees:", error);
        return res.status(500).json({ error: "Internal Server Error" });
      }
    }

    if (req.method === "POST") {
      const { name, serviceProviderId, ssn, address, pic } = req.body;

      if (!name || !serviceProviderId || !ssn || !address) {
        return res.status(400).json({ error: "All fields are required" });
      }

      // Ensure service provider belongs to logged-in user
      const serviceProvider = await prisma.serviceProvider.findUnique({
        where: { id: parseInt(serviceProviderId) },
      });

      if (!serviceProvider) {
        return res.status(403).json({ error: "Invalid service provider" });
      }

      const newEmployee = await prisma.employee.create({
        data: {
          name,
          ssn,
          address,
          pic: pic || null,
          serviceProviderId: parseInt(serviceProviderId),
        },
      });

      return res.status(201).json(newEmployee);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (tokenError) {
    console.error("Token verification error:", tokenError);
    return res.status(401).json({ error: "Invalid token or token expired" });
  }
}
