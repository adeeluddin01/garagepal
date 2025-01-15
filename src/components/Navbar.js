import { useEffect, useState } from 'react';
import { fetchWithAuth } from '../utils/api'; // Make sure to adjust the path based on your project structure

const Navbar = () => {
  const [user, setUser] = useState(null); // Stores user information
  const [isDropdownVisible, setDropdownVisible] = useState(false); // Toggles dropdown visibility


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Fetch the user data from the API
        const response = await fetchWithAuth('/api/user/me');
        console.log(response)
        // Check if user data exists
        if (response?.body?.user) {
          setUser(response.body.user);  // Set user data if exists
        } else {
          setUser(null);  // Set to null if no user found
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user data');  // Set error message
      } finally {
        // setLoading(false);  // Set loading to false once the data is fetched
      }
    };

    fetchUserData();
  }, []);  // Empty dependency array means this effect runs once on component mount



  // Handle logout
  const handleLogout = () => {
    // Clear the cookies and localStorage to log out the user
    document.cookie = 'token=; Max-Age=0; path=/;';
    localStorage.removeItem('refreshToken');
    window.location.href = '/'; // Redirect to the homepage after logout
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setDropdownVisible(prev => !prev);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        {/* Brand */}
        <div className="text-2xl font-bold text-indigo-600">GaragePal</div>

        {/* Navigation links */}
        <nav className="hidden md:flex space-x-8">
          <a href="#features" className="hover:text-indigo-500">Features</a>
          <a href="#garages" className="hover:text-indigo-500">Garages</a>
          <a href="#testimonials" className="hover:text-indigo-500">Testimonials</a>
          <a href="#contact" className="hover:text-indigo-500">Contact</a>
        </nav>

        {/* Authentication or user dropdown */}
        <div className="flex items-center space-x-4">
          {user ? (
            // If the user is authenticated, show the avatar with dropdown
            <div className="relative">
              <button
                className="flex items-center space-x-2"
                onClick={toggleDropdown} // Toggle dropdown on click
              >
                <img
                  src={user.avatar || '/default-avatar.png'} // Fallback to a default avatar
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </button>
              {isDropdownVisible && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
            {user.role === 'SERVICE_PROVIDER' && (
                  <a href="/provider" className="block px-4 py-2 text-gray-800">Dashboard</a>
                )}
                  <a href="/profile" className="block px-4 py-2 text-gray-800">Profile</a>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-gray-800">Logout</button>
                </div>
              )}
            </div>
          ) : (
            // If the user is not authenticated, show login/signup links
            <div className="space-x-4">
              <a href="/auth/login" className="hover:text-indigo-500">Login</a>
              <a href="/auth/signup" className="hover:text-indigo-500">Sign Up</a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
