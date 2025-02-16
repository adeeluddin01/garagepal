import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable logging
});

export default async function handler(req, res) {
  const { latitude, longitude, radius, query } = req.query;

  // Validate required query parameters
  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  const lat = parseFloat(latitude);
  const lon = parseFloat(longitude);
  let rad = radius ? parseFloat(radius) : 10; // Default radius to 10 miles if not provided

  // Check if the parameters are valid numbers
  if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
    return res.status(400).json({ error: 'Invalid latitude, longitude, or radius values.' });
  }

  // Approximate calculation for latitude/longitude degree distance
  const latDegreeDistance = rad / 69; // One degree of latitude = 69 miles
  const lonDegreeDistance = rad / (69 * Math.cos((lat * Math.PI) / 180)); // Adjust longitude distance based on latitude
// console.log(latDegreeDistance)
// console.log(lonDegreeDistance)
console.log(lat,lon)
console.log(query)

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

// If ry is provided, add OR conditions for businessName and services
if (query) {
  whereClause.OR = [
    { businessName: { contains: query } }, // Removed `mode: 'insensitive'`
    { services: { some: { name: { contains: query } } } }, // Removed `mode: 'insensitive'`
  ];
}

  try {
    // Fetch ServiceProviders from Prisma
    const serviceProviders = await prisma.serviceProvider.findMany({
      where: whereClause,
      include: { services: true }, // Include related services in the result
    });

    // Return the results
    if (serviceProviders.length === 0) {
      return res.status(404).json({ message: 'No service providers found.' });
    }

    return res.status(200).json(serviceProviders);
  } catch (error) {
    console.error('Error fetching service providers:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect(); // Ensure Prisma disconnects after the query
  }
}

