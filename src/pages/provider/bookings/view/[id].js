import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../../utils/api";
import ProviderLayout from "../../../../components/ProviderLayout";

const ViewBooking = () => {
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;
    
    const fetchBooking = async () => {
      try {
        const res = await fetchWithAuth(`/api/provider/bookings/${id}`);
        if (res.status === 200) {
          const bookingData = await res.body;
          setBooking(bookingData);
        } else {
          setError("Failed to fetch booking details");
        }
      } catch (err) {
        setError("Error fetching booking details");
      }
    };

    fetchBooking();
  }, [id]);

  if (!booking) {
    return (
      <ProviderLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <p>Loading booking details...</p>
        </div>
      </ProviderLayout>
    );
  }

  return (
    <ProviderLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">Booking Details</h1>

          {error && <p className="text-red-500">{error}</p>}

          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Customer</label>
              <p className="text-gray-900">{booking.customer?.name || "N/A"}</p>
              <p className="text-gray-600">{booking.customer?.email} - {booking.customer?.phone}</p>
            </div>

            {booking.customer?.vehicles?.length > 0 && (
              <div>
                <label className="block text-gray-700 font-semibold">Vehicle</label>
                <p className="text-gray-900">{booking.vehicle?.make} {booking.vehicle?.model} - {booking.vehicle?.year}</p>
              </div>
            )}

            <div>
              <label className="block text-gray-700 font-semibold">Service Provider</label>
              <p className="text-gray-900">{booking.serviceProvider?.businessName || "N/A"}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Subservice</label>
              <p className="text-gray-900">{booking.subService?.name || "N/A"}</p>
              <p className="text-gray-600">${booking.cost}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Assigned Employee</label>
              <p className="text-gray-900">{booking.employee?.name || "Not Assigned"}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Scheduled Date & Time</label>
              <p className="text-gray-900">{new Date(booking.scheduledAt).toLocaleString()}</p>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold">Status</label>
              <p className={`text-white px-2 py-1 rounded-md ${
                booking.status === "PENDING" ? "bg-yellow-500" : "bg-green-500"
              }`}>
                {booking.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default ViewBooking;
