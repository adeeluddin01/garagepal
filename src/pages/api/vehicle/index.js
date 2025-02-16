import prisma from '../../../lib/prisma';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET; // Ensure JWT_SECRET is set in your .env file

export default async function handler(req, res) {
  // Extract token from Authorization header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const userId = decoded.id; // Get user ID from token

  if (req.method === "GET") {
    try {
      const vehicles = await prisma.vehicle.findMany({
        where: { userId },
      });
      return res.status(200).json({ vehicles });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  if (req.method === "POST") {
    try {
      const { vehicleNo, vin, make, model, year, pic } = req.body;

      if (!vehicleNo || !vin || !make || !model || !year || !pic) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const newVehicle = await prisma.vehicle.create({
        data: {
          vehicleNo,
          vin,
          make,
          model,
          year: parseInt(year),
          pic,
          userId,
        },
      });

      return res.status(201).json({ message: "Vehicle added successfully", vehicle: newVehicle });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
