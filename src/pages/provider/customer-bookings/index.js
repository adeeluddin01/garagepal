import { useState, useEffect } from "react";
import Link from "next/link";
import { FaClipboardList, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import ProviderLayout from "@/components/ProviderLayout";

export default function BookingList() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/provider/customer-booking")
      .then((res) => res.json())
      .then((data) => setBookings(data));
  }, []);

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FaClipboardList className="mr-2 text-indigo-600" /> Booking Requests
          </h1>
          <Link href="/provider/customer-booking/add">
            <button className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 flex items-center">
              <FaPlus className="mr-2" /> Add Booking
            </button>
          </Link>
        </div>
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="p-3 border border-gray-300">Customer</th>
              <th className="p-3 border border-gray-300">Vehicle</th>
              <th className="p-3 border border-gray-300">Status</th>
              <th className="p-3 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr><td colSpan="4" className="text-center p-4">No bookings found.</td></tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-100">
                  <td className="p-3 border border-gray-300">{booking.customer.name}</td>
                  <td className="p-3 border border-gray-300">{booking.vehicle.vehicleNo}</td>
                  <td className="p-3 border border-gray-300">{booking.status}</td>
                  <td className="p-3 border border-gray-300 flex space-x-2">
                    <Link href={`/provider/customer-booking/${booking.id}`}>
                      <button className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                        <FaEdit className="mr-1" /> Edit
                      </button>
                    </Link>
                    <button className="p-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
                      <FaTrash className="mr-1" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </ProviderLayout>
  );
}
