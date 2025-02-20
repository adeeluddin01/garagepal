import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from environment variables.");
}

/**
 * Signs an access token with a short expiration (15 minutes).
 */
export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Signs a refresh token with a longer expiration (7 days).
 */
export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Verifies the given JWT token and handles expiration.
 * @param token - The token to verify.
 * @returns The decoded payload if the token is valid.
 * @throws Error if the token is invalid or expired.
 */
export const verifyToken = (token: string) => {
  if (!token) {
    throw new Error("Token is required for verification");
  }

  try {
    console.log("🔍 Verifying token:", token);
    return jwt.verify(token, JWT_SECRET);
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      console.error("❌ Token has expired:", err.expiredAt);
      throw new Error("TokenExpired");
    } else {
      console.error("❌ Invalid token:", err.message);
      throw new Error("InvalidToken");
    }
  }
};
