import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import GarageCard from "../../components/GarageCard";

const containerStyle = { width: "100%", height: "100vh" };
const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const GarageMapPage = () => {
  const [garages, setGarages] = useState([]);
  const [filters, setFilters] = useState({ service: "", subService: "", vehicle: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isMinimized, setIsMinimized] = useState(false); // Controls garage cards, NOT filters

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await fetch(`/api/provider/garage`);
        if (!response.ok) throw new Error("Failed to fetch garages");
        const data = await response.json();
        setGarages(data);
      } catch (error) {
        console.error("Error fetching garages:", error);
      }
    };
    fetchGarages();
  }, []);

  // Function to filter garages dynamically
  const filteredGarages = garages.filter(
    (garage) =>
      (filters.service === "" || garage.services?.includes(filters.service)) &&
      (filters.subService === "" || garage.subServices?.includes(filters.subService)) &&
      (filters.vehicle === "" || garage.vehicleTypes?.includes(filters.vehicle)) &&
      (searchQuery === "" || garage.businessName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex h-screen">
      {/* LEFT PANEL - FILTERS & GARAGE LIST */}
      <div className="w-2/5 bg-white p-4">
        {/* Left Section: Filters & Garage Cards Side-by-Side */}
        <div className="grid grid-cols-3 gap-4 h-full">
          {/* Filters Section (1/3 width) */}
          <div className="col-span-1 bg-gray-100 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold">Filter by</h2>
            <input
              type="text"
              placeholder="🔍 Search garages..."
              className="border p-2 w-full rounded mb-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select name="service" className="border p-2 w-full rounded mb-2" onChange={(e) => setFilters({ ...filters, service: e.target.value })}>
              <option value="">All Services</option>
              <option>General Repair</option>
              <option>Brake System</option>
              <option>Battery & Electrical</option>
            </select>
            <select name="subService" className="border p-2 w-full rounded mb-2" onChange={(e) => setFilters({ ...filters, subService: e.target.value })}>
              <option value="">All Sub-Services</option>
              <option>Oil Change</option>
              <option>Battery Replacement</option>
              <option>Brake Pad Replacement</option>
            </select>
            <select name="vehicle" className="border p-2 w-full rounded" onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}>
              <option value="">All Vehicles</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Truck</option>
            </select>
          </div>

          {/* Garage Cards Section (2/3 width) */}
          <div className={`col-span-2 transition-all ${isMinimized ? "hidden" : ""}`}>
            {/* Minimize Button */}
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="mb-2 px-4 py-2 bg-gray-300 rounded-lg shadow-md"
            >
              {isMinimized ? "➕ Show Garages" : "➖ Hide Garages"}
            </button>

            {/* Garage Results - Grid Layout */}
            <div className="grid grid-cols-2 gap-4 overflow-auto h-[75vh]">
              {filteredGarages.length > 0 ? (
                filteredGarages.map((garage) => <GarageCard key={garage.id} garage={garage} viewType="grid" />)
              ) : (
                <p className="text-gray-600 col-span-2">No garages found.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - MAP */}
      <div className="w-3/5 relative">
        <LoadScript googleMapsApiKey={API_KEY}>
          <GoogleMap mapContainerStyle={containerStyle} center={{ lat: 40.7128, lng: -74.006 }} zoom={12}>
            {filteredGarages.map((garage) => (
              <Marker key={garage.id} position={{ lat: garage.latitude, lng: garage.longitude }} />
            ))}
          </GoogleMap>
        </LoadScript>

        {/* Search Bar Inside Map */}
        <input
          type="text"
          placeholder="Search on map"
          className="absolute top-4 left-4 bg-white p-2 rounded shadow-md w-60"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};

export default GarageMapPage;
