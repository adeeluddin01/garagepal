import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api";
import Navbar from "../../../components/Navbar";
import SidebarSettings from "../../../components/SidebarSettings";
import { Calendar, Briefcase, User, Car, Loader, CheckCircle, XCircle } from "lucide-react";

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBookings = async () => {
      const { status, body } = await fetchWithAuth("/api/booking");

      if (status === 200) {
        setBookings(body.bookings);
      }
      setLoading(false);
    };

    fetchBookings();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto flex mt-16 px-4">
        {/* Sidebar */}
        <SidebarSettings />

        {/* Bookings Section */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          {/* Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
          </div>

          {/* Bookings List */}
          <div className="mt-4 space-y-3">
            {loading ? (
              <p className="text-gray-600 text-center">Loading bookings...</p>
            ) : bookings.length > 0 ? (
              bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">{booking.service.name}</h3>
                    <p className="text-sm text-gray-500">
                      <Briefcase className="inline w-4 h-4 text-orange-500" /> Provider: {booking.serviceProvider.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      <Calendar className="inline w-4 h-4 text-blue-500" /> Scheduled At:{" "}
                      {new Date(booking.scheduledAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {booking.status === "PENDING" && <Loader className="w-5 h-5 text-yellow-500" />}
                    {booking.status === "CONFIRMED" && <CheckCircle className="w-5 h-5 text-green-500" />}
                    {booking.status === "CANCELLED" && <XCircle className="w-5 h-5 text-red-500" />}
                    <span className="text-sm font-medium text-gray-600">{booking.status.replace("_", " ")}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">No bookings found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
