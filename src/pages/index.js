import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar.js";


export default function Home() {
  const [garages, setGarages] = useState([]); // Ensure default value is an array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGarages = async () => {
      try {
        
        const response = await fetch("/api/provider/garage", );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Ensure data is an array
        if (Array.isArray(data)) {
          setGarages(data);
        } else {
          setGarages([]);
        }
      } catch (err) {
        console.error("Error fetching garages:", err);
        setError("Failed to load garages. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGarages();
  }, []);

  

  useEffect(() => {
    const handleScroll = () => {
      document.querySelectorAll(".fade-in").forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top <= window.innerHeight - 50) {
          el.classList.add("visible");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
 
  if (loading) return <p className="text-center">Loading garages...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

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
          
            {/* Search Bar */}
          <div className="bg-white/30 shadow-lg rounded-lg p-4 flex flex-wrap md:flex-nowrap items-center justify-start space-y-3 md:space-y-0 md:space-x-4 w-full max-w-6xl">
            <input
              type="text"
              placeholder="🔍 Search for location, vehicle, or garage"
              className="border p-3 rounded w-full md:w-[40%] text-md text-black"
            />
            <select className="border p-3 rounded w-full md:w-1/5 text-md">
              <option value="">🚘 Vehicle</option>
              <option>Car</option>
              <option>Bike</option>
              <option>Truck</option>
            </select>
            <select className="border p-3 rounded w-full md:w-1/5 text-md">
              <option value="">🔧 Service</option>
              <option>Tyres</option>
              <option>Battery</option>
              <option>Oil Change</option>
            </select>
            <select className="border p-3 rounded w-full md:w-1/5 text-md">
              <option value="">🛠️ Sub-Service</option>
              <option>Changing Tyre</option>
              <option>Wheel Alignment</option>
              <option>Battery Replacement</option>
            </select>
            <div className="flex space-x-4 w-full md:w-auto">
            <button className="bg-gray-600 text-white px-4 rounded-lg hover:bg-gray-500 transition opacity-90 hover:opacity-100 text-md w-full md:w-auto" onClick={() => window.location.href = '#map'}>
                🗺️ 
              </button>
              <button className="bg-indigo-600 text-white px-4 rounded-lg hover:bg-indigo-500 transition opacity-90 hover:opacity-100 text-md w-full md:w-auto">
                🔍 Search
              </button>
              
            </div>
          </div>
        </div>
      </section>

        {/* 🚗 Featured Garages Section */}
      <section id="garages" className="py-12 bg-gray-100 fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">🏪 Featured Garages</h2>
            <a href="/garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
              View More <span className="ml-2 text-xl">➡</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {garages.length > 0 ? (
              garages.slice(0, 3).map((garage) => (
                <div key={garage.id} className="p-6 border rounded-lg bg-white shadow-lg hover:shadow-2xl transition">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    🏪 {garage.businessName}
                  </h3>
                  <p className="text-gray-600 flex items-center mt-2">
                    📍 <span className="ml-1">{garage.location}</span>
                  </p>

                  <div className="mt-4 text-sm text-gray-700">
                    <p>⭐ Average Rating: <span className="font-bold text-yellow-500">4.5</span></p>
                    <p>💰 Estimated Price: <span className="font-semibold">${garage.price || "N/A"}</span></p>
                  </div>

                  <a href={`/garages/${garage.id}`} className="block mt-4 text-indigo-600 font-semibold hover:underline">
                    More Details ➜
                  </a>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No garages found.</p>
            )}
          </div>
        </div>
      </section>

      {/* 🌟 Best Rated Garages Section */}
      <section id="best-rated-garages" className="py-12 bg-white fade-in">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">🌟 Best Rated Garages</h2>
            <a href="/best-rated-garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
              View More <span className="ml-2 text-xl">➡</span>
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {garages.length > 0 ? (
              garages
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 3)
                .map((garage, idx) => (
                  <div
                    key={garage.id}
                    className="p-6 border rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1"
                  >
                    <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                      🏆 {garage.businessName}
                    </h3>
                    <p className="text-gray-600 flex items-center mt-2">
                      📍 <span className="ml-1">{garage.location}</span>
                    </p>

                    <div className="mt-4 text-sm text-gray-700">
                      <p>⭐ Average Rating: <span className="font-bold text-yellow-500">{garage.rating || "4.5"}</span></p>
                      <p>💰 Estimated Price: <span className="font-semibold">${garage.price || "N/A"}</span></p>
                      <p>⏳ Estimated Time: <span className="font-semibold">{garage.estimatedTime || "Varies"}</span></p>
                    </div>

                    <a href={`/garages/${garage.id}`} className="block mt-4 text-indigo-600 font-semibold hover:underline">
                      View Garage ➜
                    </a>
                  </div>
                ))
            ) : (
              <p className="text-gray-600">No best-rated garages found.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-gray-900 text-white py-12 text-center"
      >
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
