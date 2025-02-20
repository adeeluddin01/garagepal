import prisma from "../../../../lib/prisma"; // Import Prisma Client

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const customers = await prisma.customerOnboarding.findMany({
        include: {
          vehicles: true, // Include vehicles for each customer
        },
      });

      return res.status(200).json(customers);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch customers", details: error.message });
    }
}


  if (req.method === "POST") {
    const { name, email, phoneNumber, latitude, longitude, customerAvatar } = req.body;
    
    try {
      const newCustomer = await prisma.customerOnboarding.create({
        data: { 
          name, 
          email, 
          phoneNumber, 
          latitude: parseFloat(latitude), 
          longitude: parseFloat(longitude), 
          customerAvatar: customerAvatar || null,  // ✅ Allow avatar to be optional
        },
      });
      return res.status(201).json(newCustomer);
    } catch (error) {
      return res.status(500).json({ error: "Failed to create customer", details: error.message });
    }
  }

  res.status(405).json({ error: "Method Not Allowed" });
}