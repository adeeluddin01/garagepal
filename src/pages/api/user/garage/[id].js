import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Fetch garage details by ID with services and sub-services including costs
    const garage = await prisma.serviceProvider.findUnique({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        businessName: true,
        location: true,
        latitude: true,
        longitude: true,
        avatar: true,
        services: {
          select: {
            id: true,
            name: true,
            subServices: {
              select: {
                id: true,
                description: true,
                cost: true, // ✅ Include cost for each sub-service
              },
            },
          },
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            user: {
              select: {
                id: true,
                name: true, // Fetch only the user name for privacy
              },
            },
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
}
