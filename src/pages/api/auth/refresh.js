import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { refreshToken } = req.body;

    try {
      // Ensure JWT_SECRET is available
      const jwtSecret = process.env.JWT_SECRET;

      if (!jwtSecret) {
        return res.status(500).json({ error: 'JWT_SECRET is not defined in environment variables' });
      }

      console.log(jwtSecret, "refresh", refreshToken);

      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, jwtSecret);
      const accessToken = jwt.sign({ id: decoded.id, role: decoded.role }, jwtSecret, { expiresIn: '15m' });
      
      res.status(200).json({ accessToken });
    } catch (error) {
      console.error('Token verification error:', error);
      res.status(401).json({ error: 'Invalid or expired refresh token' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
