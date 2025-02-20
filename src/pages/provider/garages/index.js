import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Import the fetchWithAuth utility
import ProviderLayout from "../../../components/ProviderLayout";

const GarageList = () => {
  const [garages, setGarages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if there are more items to load

  const router = useRouter();

  const loadGarages = async () => {
    if (loading || !hasMore) return; // Prevent multiple requests at the same time

    setLoading(true);

    try {
      const response = await fetchWithAuth(`/api/provider/garage?page=${page}`, {
        method: "GET",
      });

      const data = await response.body;
      console.log(data)
      if (data.length === 0) {
        setHasMore(false); // No more garages to load
      } else {
        setGarages((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1); // Increment the page number for next fetch
      }
    } catch (err) {
      setError("Failed to load garages. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGarages();
  }, []);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      loadGarages(); // Load more garages when scrolled to bottom
    }
  };
console.log(garages)
  return (

<ProviderLayout>

    <div className="min-h-screen bg-gray-100 p-6" onScroll={handleScroll}>
      <h1 className="text-3xl font-bold text-indigo-600 mb-6">Garages</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {garages.map((garage) => (
          <div key={garage.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={garage.avatar} 
              alt={garage.businessName}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-2xl font-semibold text-indigo-600">{garage.businessName}</h3>
              <p className="text-gray-600">{garage.ownerName}</p>
              <p className="text-gray-500 mt-2">{garage.location}</p>
              <button
                onClick={() => router.push(`/provider/garages/view/${garage.id}`)}
                className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center mt-6">
          <span className="text-indigo-600">Loading more garages...</span>
        </div>
      )}
      {!hasMore && (
        <div className="flex justify-center mt-6">
          <span className="text-gray-500">No more garages to load</span>
        </div>
      )}
    </div>

    </ProviderLayout>
  );
};

export default GarageList;
