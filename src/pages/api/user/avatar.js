import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import prisma from "../../../lib/prisma";

// Disable body parsing for file uploads (required for formidable)
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // Extract and verify token
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized: No token provided" });

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }

  const userId = decoded.id;

  // Import formidable dynamically to fix Next.js + Turbopack issues
  const formidable = (await import("formidable")).default;
  const form = formidable({ 
    multiples: false, 
    uploadDir: path.join(process.cwd(), "public/uploads"), 
    keepExtensions: true 
  });

  // Ensure the upload directory exists
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  // Parse the file upload
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("❌ File upload error:", err);
      return res.status(500).json({ message: "File upload failed" });
    }

    console.log("📂 Files received:", files);
    
    // Ensure a file was actually uploaded
    const file = files.file?.[0];
    if (!file) {
      console.log("❌ No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${file.newFilename}`; // Generate file path

    try {
      // Update the user's avatar in Prisma
      await prisma.user.update({
        where: { id: userId },
        data: { avatar: filePath },
      });

      console.log("✅ Avatar updated successfully:", filePath);
      return res.status(200).json({ message: "Profile picture updated", avatar: filePath });
    } catch (dbError) {
      console.error("❌ Database update failed:", dbError);
      return res.status(500).json({ message: "Failed to update profile picture" });
    }
  });
}
