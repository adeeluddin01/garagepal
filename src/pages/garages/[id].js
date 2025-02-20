import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GarageMap from "../../components/GarageMap";
import Navbar from "../../components/Navbar";

const GarageDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [garage, setGarage] = useState(null);

  useEffect(() => {
    if (id) {
      fetchGarageDetails(id);
    }
  }, [id]);

  const fetchGarageDetails = async (garageId) => {
    try {
      const response = await fetch(`/api/user/garage/${garageId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch garage details");
      }

      const data = await response.json();
      console.log("Fetched garage details:", data);
      setGarage(data);
    } catch (error) {
      console.error("Error fetching garage details:", error);
      alert("⚠️ Failed to fetch garage details.");
    }
  };

  if (!garage) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white min-h-screen font-sans">
      <Navbar />
      <section className="max-w-4xl mx-auto py-16 px-6">
        {/* 3D Card Container */}
        <div className="bg-white shadow-xl rounded-3xl p-8 relative transform hover:scale-105 transition-all duration-300 ease-in-out">
          {/* Garage Header */}
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900">{garage.businessName} Garage</h1>
            <p className="text-lg text-gray-600 mt-2">📍 {garage.location}</p>
          </div>

          {/* 🚗 Garage Image & 🗺️ Map - Side by Side */}
          <div className="mt-6 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            {/* Garage Image */}
            <div className="w-full md:w-1/2 h-48 rounded-xl overflow-hidden shadow-lg">
              {garage.avatar ? (
                <img
                  src={garage.avatar}
                  alt={`${garage.businessName} Garage`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 rounded-xl">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )}
            </div>

            {/* Small Map */}
            <div className="w-full md:w-1/2 h-48 rounded-xl overflow-hidden shadow-lg">
              <GarageMap garages={[garage]} userLocation={null} />
            </div>
          </div>

          {/* 🛠 Services Section */}
          <section className="mt-10">
            <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {garage.services.map((service) => (
                <div key={service.id} className="p-5 bg-white shadow-md rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-900">{service.name}</h3>
                  <ul className="mt-3 space-y-2">
                    {service.subServices.map((subService) => (
                      <li key={subService.id} className="flex justify-between text-gray-700">
                        <span>🔹 {subService.description}</span>
                        <span className="text-green-600 font-semibold">💰 ${subService.cost || "N/A"}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* 🌟 Reviews Section */}
          <section className="mt-10">
            <h2 className="text-3xl font-bold text-gray-800">Customer Reviews</h2>
            <div className="mt-6 space-y-4">
              {garage.reviews.length > 0 ? (
                garage.reviews.map((review) => (
                  <blockquote
                    key={review.id}
                    className="p-6 border-l-4 border-indigo-500 bg-gray-50 shadow-md rounded-xl"
                  >
                    <p className="text-gray-800 text-lg font-medium">"{review.comment}"</p>
                    <cite className="block mt-2 text-gray-600 font-semibold">- {review.user.name} ⭐ {review.rating}/5</cite>
                  </blockquote>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet.</p>
              )}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default GarageDetails;
