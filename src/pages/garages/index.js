import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import GarageCard from "../../components/GarageCard"; // New GarageCard component

const DynamicMap = dynamic(() => import("../../components/GarageMap"), { ssr: false });

export default function GaragesPage() {
  const [garages, setGarages] = useState([]);
  const [filters, setFilters] = useState({
    service: "",
    subService: "",
    vehicle: "",
  });
  const [viewType, setViewType] = useState("list"); // 'list' or 'grid'

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

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🔍 Find a Garage Near You</h1>
          <div className="flex space-x-3">
            <button 
              className={`px-4 py-2 rounded ${viewType === "list" ? "bg-indigo-600 text-white" : "bg-gray-300"}`} 
              onClick={() => setViewType("list")}
            >
              List View
            </button>
            <button 
              className={`px-4 py-2 rounded ${viewType === "grid" ? "bg-indigo-600 text-white" : "bg-gray-300"}`} 
              onClick={() => setViewType("grid")}
            >
              Grid View
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Panel: Embedded Map + Filters */}
          <div className="col-span-1">
            {/* Embedded Map */}
            <div className="mb-0">
              <DynamicMap garages={garages} embedded={true} />
              <button 
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-500 transition"
                onClick={() => window.location.href = "/garages/map"}
              >
                🗺 Show on Map
              </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 shadow rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Filter by</h2>
              
              <div className="mb-4">
                <label className="font-semibold">Service</label>
                <select 
                  className="border p-2 w-full rounded" 
                  onChange={(e) => setFilters({ ...filters, service: e.target.value })}
                >
                  <option value="">All</option>
                  <option>General Repair</option>
                  <option>Brake System</option>
                  <option>Battery & Electrical</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="font-semibold">Sub-Service</label>
                <select 
                  className="border p-2 w-full rounded" 
                  onChange={(e) => setFilters({ ...filters, subService: e.target.value })}
                >
                  <option value="">All</option>
                  <option>Oil Change</option>
                  <option>Engine Diagnostics</option>
                  <option>Brake Pad Replacement</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="font-semibold">Vehicle Type</label>
                <select 
                  className="border p-2 w-full rounded" 
                  onChange={(e) => setFilters({ ...filters, vehicle: e.target.value })}
                >
                  <option value="">All</option>
                  <option>Car</option>
                  <option>Bike</option>
                  <option>Truck</option>
                </select>
              </div>
            </div>
          </div>

          {/* Garage Cards */}
          <div className="col-span-2">
            <div className={`grid ${viewType === "grid" ? "grid-cols-3 gap-6" : "grid-cols-1 gap-3"}`}>
              {garages.map((garage) => (
                <GarageCard key={garage.id} garage={garage} viewType={viewType} />
              ))}
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
}
