import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProviderLayout from "@/components/ProviderLayout";

export default function EditBooking() {
  const [booking, setBooking] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/provider/customer-booking/${id}`)
        .then((res) => res.json())
        .then((data) => setBooking(data));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/provider/customer-booking/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    });

    if (response.ok) router.push("/provider/customer-booking");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this booking?")) {
      const response = await fetch(`/api/provider/customer-booking/${id}`, {
        method: "DELETE",
      });

      if (response.ok) router.push("/provider/customer-booking");
    }
  };

  if (!booking) return <p>Loading...</p>;

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Edit Booking</h1>
        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
          <label>Customer ID</label>
          <input type="text" value={booking.customerId} onChange={(e) => setBooking({ ...booking, customerId: e.target.value })} className="w-full p-2 border rounded" />

          <label>Vehicle ID</label>
          <input type="text" value={booking.vehicleId} onChange={(e) => setBooking({ ...booking, vehicleId: e.target.value })} className="w-full p-2 border rounded" />

          <label>Service ID</label>
          <input type="text" value={booking.serviceId} onChange={(e) => setBooking({ ...booking, serviceId: e.target.value })} className="w-full p-2 border rounded" />

          <label>Status</label>
          <select value={booking.status} onChange={(e) => setBooking({ ...booking, status: e.target.value })} className="w-full p-2 border rounded">
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">Update Booking</button>
          <button type="button" onClick={handleDelete} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 mt-2">Delete Booking</button>
        </form>
      </div>
    </ProviderLayout>
  );
}
