import jwt from 'jsonwebtoken';
import prisma from '../../../lib/prisma';

const secret = process.env.JWT_SECRET; // Ensure your JWT_SECRET is set in your .env file

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Extract token from the Authorization header (Bearer <token>)
      const token = req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
      }
      // Verify the token
      let decoded;
      try {
        decoded = jwt.verify(token, secret); // Decode and verify token
      } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
      }
      console.log(decoded)

      // Fetch user data from the database
      const user = await prisma.user.findUnique({
        where: { id: decoded.id }, // Use the decoded user ID from the token
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          phoneNumber: true,
          vehicles: true,
          role: true,
        },
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Return the user's data
      return res.status(200).json({ user });
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(500).json({ message: 'Server error: Unable to process your request' });
    }
  } else {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}
