import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar.js";

const DynamicMap = dynamic(() => import("../components/SearchMap.js"), {
  ssr: false, // Disable server-side rendering for the map
});

export default function Home() {
  const [garages, setGarages] = useState([]);

  useEffect(() => {
    fetchGarages();
  }, []);

  const fetchGarages = async () => {
    try {
      const response = await fetch("/api/user/garage");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setGarages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching garages:", error);
    }
  };

  return (
    <div className="bg-gray-50 font-sans">
      <Navbar />

      {/* Hero Section with Search Bar */}
      <section
        className="relative bg-cover bg-center h-screen flex items-center"
        style={{ backgroundImage: "url('/bg-stuck.png')" }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative w-full flex flex-col justify-center items-start text-left px-8 sm:px-12 lg:px-16 max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 fade-in">
            🚗 Stuck on the Road? <br /> Get Back in Minutes!
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 fade-in">
            ⚡ Fast, reliable roadside assistance and trusted garages.
          </p>

          {/* Search Bar - Removed Dropdowns */}
          <div className="bg-white/30 shadow-lg rounded-lg p-4 flex flex-wrap md:flex-nowrap items-center justify-start space-y-3 md:space-y-0 md:space-x-4 w-full max-w-6xl">
            <input
              type="text"
              placeholder="🔍 Search for location or garage"
              className="border p-3 rounded w-full md:w-3/4 text-md text-black"
            />
            <button className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-500 transition opacity-90 hover:opacity-100 text-md w-full md:w-auto" onClick={() => window.location.href = '#map'}>
                🗺️ 
              </button>
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition opacity-90 hover:opacity-100 text-md w-full md:w-auto">
              🔍 Search
            </button>
          </div>
        </div>
      </section>

      {/* 🏪 Featured Garages Section */}
      <section id="garages" className="py-12 bg-gray-100 fade-in">
        <div className="text-left max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🏪 Featured Garages</h2>
            <a href="/garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
              View More <span className="ml-2 text-xl">➡</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {garages.length > 0 ? (
              garages.slice(0, 3).map((garage) => (
                <a
                  key={garage.id}
                  href={`/garages/${garage.id}`}
                  className="p-6 border rounded-lg bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between relative"
                >
                  {/* Garage Image */}
                  <div className="w-full h-40 rounded-lg overflow-hidden shadow-md mb-4">
                    <img
                      src={garage.avatar ? garage.avatar : "/default-garage.jpg"}
                      alt={garage.businessName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Garage Name & Location */}
                  <h3 className="text-lg font-semibold text-gray-900">{garage.businessName}</h3>
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 inline-block w-fit">
                    📍 {garage.location}
                  </div>
                  <p className="text-gray-600 mt-2">Reliable service and assistance in your area.</p>
                </a>
              ))
            ) : (
              <p className="text-gray-500">No featured garages available.</p>
            )}
          </div>
        </div>
      </section>

      {/* 🌟 Best Rated Garages Section */}
      <section id="best-rated-garages" className="py-12 bg-white fade-in">
        <div className="text-left max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🌟 Best Rated Garages</h2>
            <a href="/garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
              View More <span className="ml-2 text-xl">➡</span>
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {garages.length > 0 ? (
              garages
                .sort((a, b) => (b.rating !== "N/A" ? b.rating - a.rating : -1))
                .slice(0, 3)
                .map((garage) => (
                  <a
                    key={garage.id}
                    href={`/garages/${garage.id}`}
                    className="p-6 border rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between relative"
                  >
                    {/* Garage Image */}
                    <div className="w-full h-40 rounded-lg overflow-hidden shadow-md mb-4">
                      <img
                        src={garage.avatar ? garage.avatar : "/default-garage.jpg"}
                        alt={garage.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {/* Garage Name & Rating */}
                    <h3 className="text-lg font-semibold text-gray-900">{garage.businessName}</h3>
                    <p className="text-gray-600">Highly rated garage with excellent service.</p>
                    <div className="flex justify-between items-center mt-4">
                      <div>
                        <span className="text-yellow-500 text-md">⭐ {garage.rating} / 5</span>
                      </div>
                    </div>
                  </a>
                ))
            ) : (
              <p className="text-gray-500">No best-rated garages available.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold mb-4">Stay Connected</h2>
          <p className="mb-8">Follow us on social media for updates!</p>
          <div className="space-x-4">
            <a href="#" className="hover:text-indigo-500">Facebook</a>
            <a href="#" className="hover:text-indigo-500">Twitter</a>
            <a href="#" className="hover:text-indigo-500">Instagram</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
