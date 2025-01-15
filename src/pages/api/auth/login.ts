import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { login, password } = req.body;
    console.log(req.body);

    // Find the user by email, username, or phone number
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: login },
          { phoneNumber: login },
          { name: login }, // Assuming "name" is used as the username
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const jwtSecret = process.env.JWT_SECRET;
    console.log(jwtSecret);
    
    // Ensure JWT_SECRET is defined
    if (!jwtSecret) {
      return res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
    }

    // Generate JWT tokens
    const accessToken = jwt.sign({ id: user.id, role: user.role }, jwtSecret, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: '7d' });

    res.status(200).json({ accessToken, refreshToken });
  }
}
