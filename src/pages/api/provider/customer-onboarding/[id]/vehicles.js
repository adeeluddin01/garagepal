import prisma from "@/lib/prisma"; // Import Prisma client

export default async function handler(req, res) {
  const { id } = req.query; // Customer ID

  if (req.method === "POST") {
    const { vehicleNo, vin, make, model, year, pic } = req.body;

    try {
      const customer = await prisma.customerOnboarding.findUnique({ where: { id: parseInt(id) } });
      if (!customer) return res.status(404).json({ error: "Customer not found" });

      const newVehicle = await prisma.vehicle.create({
        data: {
          customerId: parseInt(id),
          vehicleNo,
          vin,
          make,
          model,
          year: parseInt(year),
          pic,
        },
      });

      res.status(201).json(newVehicle);
    } catch (error) {
      console.error("Error adding vehicle:", error);
      res.status(500).json({ error: "Failed to add vehicle" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
