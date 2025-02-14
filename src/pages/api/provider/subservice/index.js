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
      const reqbody = JSON.parse(req.body);
      // Extract data from the request body
      const { serviceId, name, description ,cost } = reqbody;
      console.log(reqbody);
      if (!serviceId || !name) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Add the sub-service to the database
      const newSubService = await prisma.subService.create({
        data: {
          name,
          description,
          cost,
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
  } else if (req.method === "DELETE") {
    // Extract the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      // Verify the token
      const decoded = verifyToken(token);
      const { serviceId, subServiceId } = req.query;

      if (!serviceId && !subServiceId) {
        return res.status(400).json({ error: "Service ID or Sub-service ID required" });
      }

      if (subServiceId) {
        // Delete the sub-service from the database
        const deletedSubService = await prisma.subService.delete({
          where: {
            id: parseInt(subServiceId),
          },
        });

        return res.status(200).json({ message: "Sub-service deleted", deletedSubService });
      } else if (serviceId) {
        // Delete the service and its associated sub-services from the database
        const deletedService = await prisma.service.delete({
          where: {
            id: parseInt(serviceId),
          },
          include: {
            subServices: true, // Optionally, delete the related sub-services too
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
      } else {
        return res.status(400).json({ error: "Invalid request" });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      return res.status(500).json({ error: "Failed to delete" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
