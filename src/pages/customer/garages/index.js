import { useEffect, useState } from "react";
import GarageMap from "../../components/GarageMap";
import Navbar from "../../components/Navbar";
import { fetchWithAuth } from "../../utils/api";
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

  // Fetch garages from your API
  const fetchGarages = async (location) => {
    try {
      const response = await fetch(
        `/api/search?query=${searchQuery}&latitude=${location.lat}&longitude=${location.lng}&radius=${radius}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
       console.log("RESSS",response)

      const data = await response.json();
      console.log("RESSS",data)

      setGarages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching garages:", error);
      // alert("⚠️ Failed to fetch garage data.");
    }
  };

  // Handle search query and radius change
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!userLocation) return;

    const apiUrl = `/api/search?query=${searchQuery}&radius=${radius}&latitude=${userLocation.lat}&longitude=${userLocation.lng}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      setGarages(Array.isArray(data) ? data : []);

      // setGarages(data); // Update garages list based on search
    } catch (error) {
      console.error("Error fetching search results", error);
    }
  };

  return (
    <div className="bg-gray-50 font-sans h-screen">
      <Navbar />
      <div className="relative flex h-full mt-16">
        {/* Sidebar */}
        <div className="w-80 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">🔍 Filter Garages</h2>
          <form onSubmit={handleSearch}>
            <div className="mb-4">
              <label className="block font-medium">Search:</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Garage name or service"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium">Radius (km):</label>
              <input
                type="number"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Search
            </button>
          </form>

          {/* List of garages */}
          <div className="mt-6">
            {garages.map((garage) => (
              <div key={garage.id} className="p-4 border-b">
                <h2 className="text-lg font-semibold">{garage.businessName}</h2>
                <p>{garage.location}</p>
                <a href={`/garages/${garage.id}`} className="text-indigo-600">
                  View Details
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Full-width map */}
        <div className="flex-1">
          <GarageMap garages={garages} userLocation={userLocation} />
        </div>
      </div>
    </div>
  );
};

export default GaragesPage;
