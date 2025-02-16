import { verifyToken } from "../../../../lib/auth"; // Import the verifyToken function
import prisma from "../../../../lib/prisma"; // Import Prisma client

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);

      // Extract the serviceId from the query parameters
      const  serviceId  = req.query.id;

      if (!serviceId) {
        return res.status(400).json({ error: "Service ID required" });
      }

      // Delete the service and its associated sub-services from the database
      const deletedService = await prisma.service.delete({
        where: {
          id: parseInt(serviceId),
        },
        include: {
          subServices: true, // Optionally delete the related sub-services as well
        },
      });

      // Optionally, delete the sub-services related to the service
      if (deletedService.subServices) {
        await prisma.subService.deleteMany({
          where: {
            id: {
              in: deletedService.subServices.map(subService => subService.id),
            },
          },
        });
      }

      return res.status(200).json({ message: "Service and related sub-services deleted", deletedService });
    } catch (error) {
      console.error("Error deleting service:", error);
      return res.status(500).json({ error: "Failed to delete service" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
