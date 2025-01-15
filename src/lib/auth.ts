import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verifies the given JWT token.
 * @param token - The token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws Error if the token is invalid or expired.
 */
export const verifyToken = (token:string) => {
  if (!token) {
    throw new Error("Token is required for verification");
  }

  try {
    // Log token to verify it's not malformed
    console.log("Verifying token:", token);
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      throw new Error("Invalid token: Decoding failed");
    }
    return decoded;
  } catch (err) {
    console.error("Token verification failed:", err);
    throw new Error("Token verification failed");
  }
};

