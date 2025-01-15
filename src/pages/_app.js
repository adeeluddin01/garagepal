import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import cookie from 'cookie'; // Import the cookie library
import './styles/globals.css'; // Your global styles

// Helper function to get the user's role from the JWT token
const getRoleFromToken = (token) => {
  if (!token) return null;

  try {
    const decoded = jwt.decode(token);
    return decoded ? decoded.role : null;
  } catch (err) {
    return null;
  }
};

function MyApp({ Component, pageProps }) {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Get cookies from the request headers
    const cookies = cookie.parse(document.cookie); // Parse cookies on the client side
    const token = cookies.token; // Access the 'token' cookie
    console.log("_APP TOKEN",token)
    // If a token is available, decode the role
    const userRole = getRoleFromToken(token);
    setRole(userRole);

    // // Redirect based on the role
    // if (userRole === 'CUSTOMER' && router.pathname !== '/customer') {
    //   router.push('/customer'); // Redirect to customer dashboard
    // } else if (userRole === 'SERVICE_PROVIDER' && router.pathname !== '/provider') {
    //   router.push('/provider'); // Redirect to service provider dashboard
    // } else if (!userRole && router.pathname !== '/login') {
    //   router.push('/login'); // If no role, redirect to login
    // }
  }, [router.pathname]);

  // // If no role is determined yet, show a loading screen or the login page
  // if (role === null) {
  //   return <div>Loading...</div>;
  // }

  return <Component {...pageProps} />;
}

export default MyApp;
