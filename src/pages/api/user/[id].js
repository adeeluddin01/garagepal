import prisma from "../../../lib/prisma";
import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).json({ message: "Bad Request: User ID is required" });

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, secret);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const userId = parseInt(id, 10);

  // Allow updating only if the user is editing their own profile or if the user is ADMIN
  if (decoded.id !== userId && decoded.role !== "ADMIN") {
    return res.status(403).json({ message: "Forbidden: Access denied" });
  }

  if (req.method === "GET") {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          phoneNumber: true,
          role: true,
          avatar: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.error("❌ Error fetching user:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } 
  else if (req.method === "PUT") {
    try {
      const { name, email, phoneNumber, avatar } = req.body; // Fields user can update

      // Ensure at least one field is being updated
      if (!name && !email && !phoneNumber && !avatar) {
        return res.status(400).json({ message: "Bad Request: No fields to update" });
      }

      // Update the user in Prisma
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name, email, phoneNumber, avatar },
      });

      return res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
      console.error("❌ Error updating user:", error);
      return res.status(500).json({ message: "Server error: Unable to update profile" });
    }
  } 
  else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}
