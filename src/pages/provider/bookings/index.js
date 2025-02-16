import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Import the fetchWithAuth utility
import ProviderLayout from "../../../components/ProviderLayout";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const router = useRouter();

  const loadBookings = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const response = await fetchWithAuth(`/api/provider/bookings?page=${page}`, {
        method: "GET",
      });

      const data = await response.body.bookings;
      console.log("Fetched bookings:", data);

      if (!data || !Array.isArray(data) || data.length === 0) {
        setHasMore(false);
      } else {
        setBookings((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleScroll = (e) => {
    const bottom = e.target.scrollHeight === e.target.scrollTop + e.target.clientHeight;
    if (bottom) {
      loadBookings();
    }
  };

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-100 p-6" onScroll={handleScroll}>
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">Bookings</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
              <h3 className="text-1xl font-semibold text-indigo-600">
                Service Name: {booking.subService.name} {/* Placeholder for actual service name */}
              </h3>
              <p className="text-gray-600 font-semibold text-indigo-600">
                Customer ID: {booking.customer.name} {/* Placeholder for actual customer name */}
              </p>
              <p className="text-gray-500 mt-2 font-semibold text-indigo-600">Status: {booking.status}</p>
              <p className="text-gray-500 mt-2">
                Scheduled: {new Date(booking.scheduledAt).toLocaleString()}
              </p>
              <button
                onClick={() => router.push(`/provider/bookings/view/${booking.id}`)}
                className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center mt-6">
            <span className="text-indigo-600">Loading more bookings...</span>
          </div>
        )}
        {!hasMore && (
          <div className="flex justify-center mt-6">
            <span className="text-gray-500">No more bookings to load</span>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default BookingList;
