import { useEffect, useState } from "react";
import GarageMap from "../../components/GarageMap";

const GaragesPage = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          fetchGarages();
        },
        (error) => console.error("Error getting location:", error)
      );
    }
  }, []);

  // Fetch garages from YOUR API (instead of Google Places)
  const fetchGarages = async () => {
    try {
      const response = await fetch("/api/provider/garage", {
        headers: {
          Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with real token logic
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched garages:", data);

      setGarages(data);
    } catch (error) {
      console.error("Error fetching garages:", error);
      alert("⚠️ Failed to fetch garage data.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold">🔍 Nearby Garages</h1>
      <GarageMap garages={garages} userLocation={userLocation} />
      <div className="mt-6">
        {garages.map((garage) => (
          <div key={garage.id} className="p-4 border-b">
            <h2 className="text-xl font-semibold">{garage.businessName}</h2>
            <p>{garage.location}</p>
            <a href={`/garages/${garage.id}`} className="text-indigo-600">View Details</a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GaragesPage;
