import { useEffect, useState } from "react";
import GarageMap from "../../components/GarageMap";
import Navbar from "../../components/Navbar";

const GaragesPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [garages, setGarages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [radius, setRadius] = useState(10); // Default radius in km

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          fetchGarages(location);
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  const fetchGarages = async (location) => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get stored token (if exists)
  
      const response = await fetch(
        `/api/user/garage?latitude=${location.lat}&longitude=${location.lng}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {}, // ✅ Send token only if available
        }
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setGarages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching garages:", error);
    }
  };
  
  

  // ✅ Handles search query and radius change
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userLocation) return;

    try {
      const response = await fetch(
        `/api/user/garage?query=${searchQuery}&radius=${radius}&latitude=${userLocation.lat}&longitude=${userLocation.lng}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGarages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen font-sans">
      <Navbar />
      <div className="relative flex h-full mt-16">
        {/* Sidebar with Filters */}
        <div className="w-80 bg-white shadow-xl rounded-xl p-5 overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">🔍 Find Garages</h2>
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Search:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Garage name or service"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium text-gray-700">Radius (km):</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
              Search
            </button>
          </form>

          {/* 🏪 List of Garages */}
          <div className="mt-6">
            {garages.length > 0 ? (
              garages.map((garage) => (
                <div
                  key={garage.id}
                  className="p-4 bg-white border border-gray-200 rounded-lg shadow-md mb-4 flex items-center gap-4 transition transform hover:scale-105"
                >
                  {/* Garage Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden shadow-md">
                    <img
                      src={garage.avatar ? garage.avatar : "/default-garage.jpg"} // ✅ Fallback image
                      alt={garage.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Garage Details */}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">{garage.businessName}</h2>
                    <p className="text-gray-600">{garage.location}</p>
                    <a
                      href={`/garages/${garage.id}`}
                      className="text-indigo-600 font-medium hover:underline"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No garages found.</p>
            )}
          </div>

        </div>

        {/* 📍 Full-width Map */}
        <div className="flex-1 p-4">
          <GarageMap garages={garages} userLocation={userLocation} />
        </div>
      </div>
    </div>
  );
};

export default GaragesPage;
