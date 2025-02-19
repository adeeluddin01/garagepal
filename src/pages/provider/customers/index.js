import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; 
import ProviderLayout from "../../../components/ProviderLayout";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await fetchWithAuth(`/api/provider/customers`, { method: "GET" });
        const data = await response.body;
        console.log(data.customers)
        if (data.customers) {
          setCustomers(data.customers);
        } else {
          setError("No customers found.");
        }
      } catch (err) {
        console.error("Error fetching customers:", err);
        setError("Failed to load customers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-2xl font-bold text-indigo-600 mb-6">Customers</h1>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {customers.map((customer) => (
            <div key={customer.id} className="bg-white shadow-lg rounded-lg overflow-hidden p-4">
                            <h3 className="text-1xl font-semibold text-indigo-600">
                Service: {customer.subService.name} - {customer.cost}
              </h3>
              <h3 className="text-1xl font-semibold text-indigo-600">
                Name: {customer.customer.name}
              </h3>
              <p className="text-gray-600 font-semibold">
                Email: {customer.customer.email}
              </p>
              <button
                onClick={() => router.push(`/provider/customers/view/${customer.id}`)}
                className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
        {loading && (
          <div className="flex justify-center mt-6">
            <span className="text-indigo-600">Loading customers...</span>
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default CustomerList;
