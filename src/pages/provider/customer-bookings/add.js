import { useState } from "react";
import { useRouter } from "next/router";
import ProviderLayout from "@/components/ProviderLayout";

export default function AddBooking() {
  const [customerId, setCustomerId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/provider/customer-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customerId, vehicleId, serviceId }),
    });

    if (response.ok) router.push("/provider/customer-booking");
  };

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Add Booking</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="text" placeholder="Customer ID" value={customerId} onChange={(e) => setCustomerId(e.target.value)} required className="w-full p-2 border rounded" />
          <button type="submit" className="bg-green-600 text-white p-2 rounded-md">Create Booking</button>
        </form>
      </div>
    </ProviderLayout>
  );
}
