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
      const response = await fetch(`/api/provider/garage/${garageId}`, {
        headers: {
          Authorization: `Bearer YOUR_AUTH_TOKEN`, // Replace with real token logic
        },
      });

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
    <div className="bg-gray-50 font-sans">
      <Navbar />
      <section className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-gray-800">{garage.businessName}</h1>
        <p className="text-lg text-gray-600 mt-2">📍 {garage.location}</p>
        <p className="mt-4 text-gray-700">{garage.ownerName}'s Garage</p>

        {/* Small Map */}
        <div className="mt-6 w-full h-64 rounded-lg overflow-hidden shadow-md">
          <GarageMap garages={[garage]} userLocation={null} />
        </div>

        {/* Services Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Services</h2>
          <ul className="mt-4">
            {garage.services.map((service) => (
              <li key={service.id} className="border p-4 rounded-md shadow-md mb-2">
                <strong>{service.name}</strong>
                <ul className="text-sm mt-2">
                  {service.subServices.map((subService) => (
                    <li key={subService.id}>🔹 {subService.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </section>

        {/* Reviews Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-bold text-gray-800">Customer Reviews</h2>
          <div className="mt-4 space-y-4">
            {garage.reviews.map((review) => (
              <blockquote key={review.id} className="p-4 border-l-4 border-indigo-600 bg-white shadow-md">
                <p className="text-gray-700">"{review.comment}"</p>
                <cite className="block mt-2 text-gray-800 font-semibold">
                  - {review.user.name}
                </cite>
              </blockquote>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
};

export default GarageDetails;
