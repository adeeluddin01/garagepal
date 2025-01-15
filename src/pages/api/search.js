import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable logging
});

export default async function handler(req, res) {
  const { latitude, longitude, radius, query } = req.query;

  // Validate required query parameters
  if (!latitude || !longitude || !radius) {
    return res.status(400).json({ error: 'Latitude, longitude, and radius are required.' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  const rad = parseFloat(radius);

  // Check if the parameters are valid numbers
  if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
    return res.status(400).json({ error: 'Invalid latitude, longitude, or radius values.' });
  }

  // Approximate calculation for latitude/longitude degree distance
  const latDegreeDistance = rad / 69; // One degree of latitude = 69 miles
  const lonDegreeDistance = rad / (69 * Math.cos((lat * Math.PI) / 180)); // Adjust longitude distance based on latitude

  // Build the where clause for Prisma query
  let whereClause = {
    latitude: {
      gte: lat - latDegreeDistance, // Lower bound for latitude
      lte: lat + latDegreeDistance, // Upper bound for latitude
    },
    longitude: {
      gte: lon - lonDegreeDistance, // Lower bound for longitude
      lte: lon + lonDegreeDistance, // Upper bound for longitude
    },
  };

  // Add search query if provided
  if (query) {
    whereClause.businessName = {
      contains: query, // Remove the `mode` field as it's not supported
    };
  }
  // Add search query for services if provided
  if (query) {
    whereClause.services = {
      some: {
        name: {
          contains: query, // Filter services by name containing the query
        },
      },
    };
  }

  try {
    // Fetch ServiceProviders from Prisma
    const serviceProviders = await prisma.serviceProvider.findMany({
      where: whereClause,
      include: { services: true }, // Include related services in the result
    });

    // Return the results
    if (serviceProviders.length === 0) {
      return res.status(404).json({ message: 'No service providers found within the specified radius.' });
    }

    return res.status(200).json(serviceProviders);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the query
  }
}
