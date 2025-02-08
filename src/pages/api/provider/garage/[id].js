import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Get the garage ID from the query parameters

  if (req.method === "GET") {
    try {
      // Fetch garage details including services and sub-services
      const garage = await prisma.serviceProvider.findUnique({
        where: { id: parseInt(id) },
        include: {
          services: {
            include: {
              subServices: true, // ✅ Fetches sub-services directly
            },
          },
        },
      });

      if (!garage) {
        return res.status(404).json({ error: "Garage not found" });
      }

      return res.status(200).json(garage);
    } catch (error) {
      console.error("Error fetching garage details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else if (req.method === "PUT") {
    try {
      const { email, password, phoneNumber, businessName, ownerName, location, latitude, longitude, description } = req.body;

      // Update the garage details
      const updatedGarage = await prisma.serviceProvider.update({
        where: { id: parseInt(id) },
        data: {
          email,
          password, // Ideally, hash the password before saving
          phoneNumber,
          businessName,
          ownerName,
          location,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
          description, // ✅ Update description
        },
      });

      return res.status(200).json(updatedGarage);
    } catch (error) {
      console.error("Error updating garage details:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
