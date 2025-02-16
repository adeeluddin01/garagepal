import fs from "fs";
import path from "path";

// Disable body parsing for file uploads
export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  // Dynamically import formidable
  const formidable = (await import("formidable")).default;
  const form = formidable({ multiples: false, uploadDir: path.join(process.cwd(), "public/uploads"), keepExtensions: true });

  // Ensure upload directory exists
  if (!fs.existsSync(form.uploadDir)) {
    fs.mkdirSync(form.uploadDir, { recursive: true });
  }

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ message: "File upload failed", error: err });

    const file = files.file?.[0]; // Access uploaded file
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const filePath = `/uploads/${file.newFilename}`; // Frontend-accessible path
    return res.status(200).json({ fileUrl: filePath });
  });
}
