import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, phoneNumber, name, role } = req.body;

    // Validate required fields
    if (!password || !name || !role || (!email && !phoneNumber)) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if the email or phoneNumber already exists
    let existingUser = null;

    if (email) {
      existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    if (!existingUser && phoneNumber) {
      existingUser = await prisma.user.findUnique({ where: { phoneNumber } });
      if (existingUser) {
        return res.status(400).json({ error: 'Phone number already in use' });
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare the user data
    const userData: any = {
      password: hashedPassword,
      name,
      role,
    };

    if (email) userData.email = email;
    if (phoneNumber) userData.phoneNumber = phoneNumber;

    try {
      // Create the user in the database
      const newUser = await prisma.user.create({
        data: userData,
      });

      const jwtSecret = process.env.JWT_SECRET;
      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET is not defined' });
      }

      // Generate JWT token
      const tokenPayload = { id: newUser.id, role: newUser.role };
      const accessToken = jwt.sign(tokenPayload, jwtSecret, { expiresIn: '15m' });

      return res.status(201).json({
        message: 'User created successfully',
        user: newUser,
        accessToken,
      });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Error creating user' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
