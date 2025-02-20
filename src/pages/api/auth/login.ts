import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { login, password } = req.body;
  console.log("Login request received:", req.body);

  try {
    // ✅ Fix: Use "username" instead of "name"
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { phoneNumber: login },
          { username: login }, // ✅ Corrected field
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // ✅ Fix: Check if password is hashed
    let isValid = false;
    if (user.password.startsWith('$2b$')) { // If hashed (bcrypt)
      isValid = await bcrypt.compare(password, user.password);
    } else {
      isValid = password === user.password; // If plain text
    }

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // ✅ Fix: Ensure JWT_SECRET is loaded
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is missing from environment variables.");
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    // ✅ Generate JWT Tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });

    return res.status(200).json({ accessToken, refreshToken, user });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
