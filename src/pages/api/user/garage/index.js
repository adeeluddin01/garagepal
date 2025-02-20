import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const garages = await prisma.serviceProvider.findMany({
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
                name: true,
              },
            },
          },
        },
        reviews: {
          select: {
            rating: true,
          },
        },
      },
      take: 10, // Fetch top 10 garages
    });

    // ✅ Calculate average rating dynamically
    const formattedGarages = garages.map((garage) => {
      const ratings = garage.reviews.map((r) => r.rating);
      const averageRating =
        ratings.length > 0 ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "N/A";

      return {
        ...garage,
        rating: averageRating, // Add calculated rating
      };
    });

    return res.status(200).json(formattedGarages);
  } catch (error) {
    console.error("Error fetching garages:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
