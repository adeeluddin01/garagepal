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

      // Extract the subServiceId from the query parameters
      const { subServiceId } = req.query;

      if (!subServiceId) {
        return res.status(400).json({ error: "Sub-service ID required" });
      }

      // Delete the sub-service from the database
      const deletedSubService = await prisma.subService.delete({
        where: {
          id: parseInt(subServiceId),
        },
      });

      return res.status(200).json({ message: "Sub-service deleted", deletedSubService });
    } catch (error) {
      console.error("Error deleting sub-service:", error);
      return res.status(500).json({ error: "Failed to delete sub-service" });
    }
  } else {
    // Method not allowed
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
