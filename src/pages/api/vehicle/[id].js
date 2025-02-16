import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const { id } = req.query;
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  switch (req.method) {
    case "GET":
      return getVehicle(req, res, id);
    case "PUT":
      return updateVehicle(req, res, id, decoded.id);
    case "DELETE":
      return deleteVehicle(req, res, id, decoded.id);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}

// **🚀 Get a Vehicle by ID**
async function getVehicle(req, res, vehicleId) {
  try {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.status(200).json({ vehicle });
  } catch (error) {
    console.error("Error fetching vehicle:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// **🚀 Update a Vehicle**
async function updateVehicle(req, res, vehicleId, userId) {
  try {
    const { vehicleNo, vin, make, model, year, pic } = JSON.parse(req.body);

    // Check if vehicle exists and belongs to user
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
    });

    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (existingVehicle.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your vehicle" });
    }

    const updatedVehicle = await prisma.vehicle.update({
      where: { id: parseInt(vehicleId) },
      data: { vehicleNo, vin, make, model, year: parseInt(year), pic },
    });

    return res.status(200).json({ message: "Vehicle updated successfully", updatedVehicle });
  } catch (error) {
    console.error("Error updating vehicle:", error);
    return res.status(500).json({ message: "Server error" });
  }
}

// **🚀 Delete a Vehicle**
async function deleteVehicle(req, res, vehicleId, userId) {
  try {
    // Check if vehicle exists
    const existingVehicle = await prisma.vehicle.findUnique({
      where: { id: parseInt(vehicleId) },
    });

    if (!existingVehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Ensure only the owner can delete their vehicle
    if (existingVehicle.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized: Not your vehicle" });
    }

    await prisma.vehicle.delete({
      where: { id: parseInt(vehicleId) },
    });

    return res.status(200).json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    console.error("Error deleting vehicle:", error);
    return res.status(500).json({ message: "Server error" });
  }
}
