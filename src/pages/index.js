import { useEffect, useRef  } from "react";
import dynamic from 'next/dynamic';
import "leaflet/dist/leaflet.css";
import Navbar from "../components/Navbar.js";

const DynamicMap = dynamic(() => import('../components/SearchMap.js'), {
  ssr: false, // Disable server-side rendering for the map
});

export default function Home() {
  
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

       {/* Featured Garages Section */}
        <section id="garages" className="py-12 bg-gray-100 fade-in">
          <div className="text-left max-w-7xl mx-auto px-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">🏪 Featured Garages</h2>
              <a href="/garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
                View More <span className="ml-2 text-xl">➡</span>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((id) => (
                <a href={`/garages/${id}`} key={id} className="p-6 border rounded-lg bg-white shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between relative">
                  <div className="flex items-center mb-2">
                    <span className="text-3xl mr-2">🏪</span>
                    <h3 className="text-lg font-semibold">Garage {id}</h3>
                  </div>
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 inline-block w-fit">
                    📍 Location {id}
                  </div>
                  <p className="text-gray-600 mt-2">Reliable service and assistance in your area.</p>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <span className="text-yellow-500 text-md">⭐ 4.{id} / 5</span>
                    </div>
                    <div className="text-gray-800 font-bold">💰 $20/hr</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>


{/* Best Rated Garages Section */}
<section id="best-rated-garages" className="py-12 bg-white fade-in">
  <div className="text-left max-w-7xl mx-auto px-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold text-gray-800">🌟 Best Rated Garages</h2>
      {/* View More Button */}
      <a href="/best-rated-garages" className="text-indigo-600 font-semibold text-lg flex items-center hover:underline">
        View More <span className="ml-2 text-xl">➡</span>
      </a>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map((_, idx) => (
        <div
          key={idx}
          className="p-6 border rounded-lg bg-gray-50 shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 flex flex-col justify-between relative"
        >
          <div className="flex items-center mb-2">
            <span className="text-3xl mr-2">🏆</span>
            <h3 className="text-lg font-semibold">Top Garage {idx + 1}</h3>
          </div>
          {/* Location placed directly under Garage Name */}
          <div className="bg-gray-200 px-3 py-1 rounded-full text-sm font-semibold text-gray-800 inline-block w-fit">
            📍 Location {idx + 1}
          </div>
          <p className="text-gray-600 mt-2">Highly rated garage with excellent customer service.</p>
          <div className="flex justify-between items-center mt-4">
            <div>
              <span className="text-yellow-500 text-md">⭐ 4.{idx + 7} / 5</span>
            </div>
            <div className="text-gray-800 font-bold">💰 $25/hr</div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>


      

    
      
        
      
      {/* How It Works */}
      <section
        id="features"
        className="py-16 bg-white text-center fade-in"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          How GaragePal Works
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Describe Your Problem", icon: "🔧" },
            { title: "Find Nearby Help", icon: "📍" },
            { title: "Get Back on the Road", icon: "🚗" },
          ].map((step, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-lg shadow-lg hover:shadow-2xl transform transition hover:-translate-y-1"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">
                {`Step ${idx + 1}: ${step.title}. It's quick, easy, and reliable!`}
              </p>
            </div>
          ))}
        </div>
      </section>

      

      {/* Testimonials */}
      <section id="testimonials" className="py-16 bg-white text-center fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          What Our Customers Say
        </h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2].map((_, idx) => (
            <blockquote key={idx} className="p-6 border-l-4 border-indigo-600">
              <p className="text-gray-600">
                "GaragePal saved my day! The mechanic arrived within 20
                minutes and fixed my car efficiently."
              </p>
              <cite className="block mt-4 text-gray-800 font-semibold">
                John Doe
              </cite>
            </blockquote>
          ))}
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
