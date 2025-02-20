import { verifyToken } from "../../../../lib/auth"; // Import token verification
import prisma from "../../../../lib/prisma"; // Import Prisma instance

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // ✅ Extract token from Authorization header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // ✅ Verify the token with proper error handling
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      if (err.message === "TokenExpired") {
        return res.status(401).json({ error: "Session expired. Please log in again." });
      }
      return res.status(401).json({ error: "Invalid token." });
    }

    console.log("✅ Decoded Token:", decoded);

    const { id, email, phoneNumber, name, username } = req.query;

    console.log("🔍 Received Query:", req.query);

    // ✅ Build the `where` condition dynamically
    const where = {};

    if (id && !isNaN(id)) where.id = parseInt(id);
    if (email) where.email = email;
    if (phoneNumber) where.phoneNumber = phoneNumber;
    if (name) where.name = { contains: name, mode: "insensitive" };
    if (username) where.username = { contains: username, mode: "insensitive" };

    console.log("🛠 Generated Prisma where clause:", JSON.stringify(where, null, 2));

    // ✅ Fetch users based on filter conditions
    const users = await prisma.user.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      select: {
        id: true,
        email: true,
        phoneNumber: true,
        name: true,
        username: true,
        avatar: true,
        role: true,
        createdAt: true,
        vehicles: true,
      },
    });

    console.log("📌 Fetched Users:", users);

    return res.status(200).json(users);
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
