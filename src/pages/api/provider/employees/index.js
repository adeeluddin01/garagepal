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
        // Ensure the user is authenticated
        if (!decoded || !decoded.id) {
          return res.status(401).json({ error: "Unauthorized" });
        }
    
        // Get all service providers owned by the user
        const serviceProviders = await prisma.serviceProvider.findMany({
          where: { userId: decoded.id }, // ✅ Filter service providers by userId
          select: { id: true },
        });
    
        // Extract service provider IDs
        const serviceProviderIds = serviceProviders.map(sp => sp.id);
    
        // Fetch employees only from these service providers
        const employees = await prisma.employee.findMany({
          where: { serviceProviderId: { in: serviceProviderIds } }, // ✅ Filter employees by serviceProviderId
          select: {
            id: true,
            name: true,
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
      console.log(req.body)
      const { name,serviceProviderId } = req.body;
      if (!name) return res.status(400).json({ error: "Employee name is required" });
      console.log("DECODED ID",decoded,name)
      // Create a new employee under the logged-in service provider
      const newEmployee = await prisma.employee.create({
        data: {
          name,
          serviceProviderId, // Assign to the logged-in service provider
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
