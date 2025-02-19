import { verifyToken } from "../../../../lib/auth"; 
import prisma from "../../../../lib/prisma"; 

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
    console.log(decoded, "Decoded user from customers API");
  } catch (tokenError) {
    console.error("Token verification error:", tokenError);
    return res.status(401).json({ error: "Invalid token or token expired" });
  }

  if (req.method === "GET") {
    try {
      const customers = await prisma.booking.findMany({
        where: { userId: decoded.id },
        select: {
            serviceProvider:true,
            cost:true,
          customer: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          subService: {
            select: {
              id: true,
              name: true,
            }
          }
        },
        distinct: ["customerId"]
      });

      if (!customers || customers.length === 0) {
        return res.status(200).json({ customers: [], message: "No customers found" });
      }

      return res.status(200).json({ customers });
    } catch (dbError) {
      console.error("Database error while fetching customers:", dbError);
      return res.status(500).json({ error: "Failed to fetch customers" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
