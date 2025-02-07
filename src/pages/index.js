import { useEffect,useRef  } from "react";
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

      {/* Header */}
<Navbar />
      {/* <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
          <div className="text-2xl font-bold text-indigo-600">GaragePal</div>
          <nav className="hidden md:flex space-x-8">
            <a href="#features" className="hover:text-indigo-500">Features</a>
            <a href="#garages" className="hover:text-indigo-500">Garages</a>
            <a href="#testimonials" className="hover:text-indigo-500">Testimonials</a>
            <a href="#contact" className="hover:text-indigo-500">Contact</a>
          </nav>
          <div>
            {isAuthenticated ? (
              <div className="relative">
                <button className="flex items-center space-x-2 bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-500 transition">
                  <img src="/avatar.png" alt="Avatar" className="w-6 h-6 rounded-full" />
                  <span>Profile</span>
                </button>
                <ul className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden">
                  <li><a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">My Profile</a></li>
                  <li><a href="/settings" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">Settings</a></li>
                  <li><a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-indigo-500 hover:text-white">Logout</a></li>
                </ul>
              </div>
            ) : (
              <a href="/login" className="hidden md:inline-block bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-500 transition">Login</a>
            )}
          </div>
        </div>
      </header>
  */}
      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-screen"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 fade-in">
            Stuck on the Road? <br /> Get Back in Minutes!
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-6 fade-in">
            Fast, reliable roadside assistance and trusted garages.
          </p>
          <a
            href="#get-mechanic"
            className="bg-indigo-600 text-white px-6 py-3 rounded-full text-lg hover:bg-indigo-500 transition fade-in"
          >
            Get a Mechanic Now
          </a>
        </div>
      </section>
      <div className="mt-[10px]">
        <DynamicMap />
      </div>
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

      {/* Featured Garages */}
      <section id="garages" className="py-16 bg-gray-100 fade-in">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">
            Featured Garages
          </h2>
          <p className="text-gray-600">
            Trusted garages near you. Highly rated and ready to assist.
          </p>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
          {[1, 2, 3].map((_, idx) => (
            <div
              key={idx}
              className="p-6 border rounded-lg bg-white shadow hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <h3 className="text-lg font-semibold mb-2">Garage {idx + 1}</h3>
              <p className="text-gray-600">
                Reliable service and assistance. Located in your area.
              </p>
              <a
                href="#"
                className="text-indigo-600 mt-4 inline-block hover:underline"
              >
                View Details
              </a>
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
