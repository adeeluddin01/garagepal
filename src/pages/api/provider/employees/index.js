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
      // Fetch only employees of the logged-in service provider
      const employees = await prisma.employee.findMany({
        where: { serviceProviderId: decoded.id },
        select: {
          id: true,
          name: true,
          serviceProvider: { select: { businessName: true } },
        },
      });

      return res.status(200).json(employees);
    }

    if (req.method === "POST") {
      const { name } = req.body;
      if (!name) return res.status(400).json({ error: "Employee name is required" });
      console.log("DECODED ID",decoded)
      // Create a new employee under the logged-in service provider
      const newEmployee = await prisma.employee.create({
        data: {
          name,
          serviceProviderId: parseInt(decoded.id), // Assign to the logged-in service provider
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
