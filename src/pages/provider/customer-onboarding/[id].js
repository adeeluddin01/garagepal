import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import ProviderLayout from "@/components/ProviderLayout";
import { FaArrowLeft, FaCar, FaEdit, FaPlus, FaTrash } from "react-icons/fa";

export default function CustomerDetails() {
  const router = useRouter();
  const { id } = router.query; // Get Customer ID from URL
  const [customer, setCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/provider/customer-onboarding/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();
        setCustomer(data.customer);
        setVehicles(data.vehicles);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) return <p className="text-center text-indigo-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
        {/* Back Button */}
        <button onClick={() => router.push("/provider/customer-onboarding")} className="text-indigo-600 flex items-center mb-4">
          <FaArrowLeft className="mr-2" /> Back to Customers
        </button>

        {/* Customer Details */}
        <h1 className="text-2xl font-bold">{customer.name}</h1>
        <p className="text-gray-600">{customer.email || "No email provided"}</p>
        <p className="text-gray-600">{customer.phoneNumber || "No phone provided"}</p>
        <p className="text-gray-600">
          Location: {customer.latitude}, {customer.longitude}
        </p>

        {/* Edit & Delete Buttons */}
        <div className="mt-4 flex space-x-4">
          <Link href={`/provider/customer-onboarding/${id}/edit`}>
            <button className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
              <FaEdit className="mr-2" /> Edit Customer
            </button>
          </Link>
          <button className="p-2 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>

        {/* Vehicle Section */}
        <div className="mt-6">
          <h2 className="text-xl font-bold flex items-center">
            <FaCar className="mr-2 text-indigo-600" /> Vehicles
          </h2>
          {vehicles.length === 0 ? (
            <p className="text-gray-600">No vehicles found.</p>
          ) : (
            <ul className="mt-2 space-y-3">
              {vehicles.map((vehicle) => (
                <li key={vehicle.id} className="p-3 border rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Vehicle Image */}
                    {vehicle.pic ? (
                      <img src={vehicle.pic} alt="Vehicle" className="w-24 h-24 object-cover rounded-lg border" />
                    ) : (
                      <div className="w-24 h-24 bg-gray-200 flex items-center justify-center rounded-lg">
                        <FaCar className="text-gray-500 text-3xl" />
                      </div>
                    )}

                    {/* Vehicle Details */}
                    <div>
                      <p className="text-lg font-semibold">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                      <p className="text-gray-600">VIN: {vehicle.vin}</p>
                      <p className="text-gray-600">Vehicle No: {vehicle.vehicleNo}</p>
                    </div>
                  </div>
                  {/* View Button */}
                  <Link href={`/provider/vehicles/${vehicle.id}`}>
                    <button className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                      View
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add Vehicle Button */}
        <Link href={`/provider/customer-onboarding/${id}/add-vehicle`}>
          <button className="mt-4 p-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center">
            <FaPlus className="mr-2" /> Add Vehicle
          </button>
        </Link>
      </div>
    </ProviderLayout>
  );
}
