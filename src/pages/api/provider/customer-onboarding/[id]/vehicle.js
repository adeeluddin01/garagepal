import prisma from "../../../../lib/prisma"; // Import Prisma client

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) return res.status(400).json({ error: "Customer ID is required" });

  try {
    switch (req.method) {
      // 🔹 GET: Fetch a customer along with their vehicles
      case "GET":
        const customer = await prisma.customerOnboarding.findUnique({
          where: { id: parseInt(id) },
        });

        if (!customer) return res.status(404).json({ error: "Customer not found" });

        // Fetch customer's vehicles
        const vehicles = await prisma.vehicle.findMany({
          where: { customerId: parseInt(id) },
        });

        return res.status(200).json({ customer, vehicles });

      // 🔹 PUT: Update customer details
      case "PUT":
        const { name, email, phoneNumber, latitude, longitude, customerAvatar } = req.body;

        const updatedCustomer = await prisma.customerOnboarding.update({
          where: { id: parseInt(id) },
          data: { name, email, phoneNumber, latitude, longitude, customerAvatar },
        });

        return res.status(200).json(updatedCustomer);

      // 🔹 DELETE: Remove customer and related vehicles
      case "DELETE":
        // Delete related vehicles first (if necessary)
        await prisma.vehicle.deleteMany({ where: { customerId: parseInt(id) } });

        // Delete customer
        await prisma.customerOnboarding.delete({ where: { id: parseInt(id) } });

        return res.status(204).end();

      // 🔹 Invalid method handler
      default:
        return res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    console.error(`❌ Error in /customer-onboarding/${id}:`, error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}