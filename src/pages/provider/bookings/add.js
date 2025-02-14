import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api";
import ProviderLayout from "../../../components/ProviderLayout";

const AddBooking = () => {
  const [serviceProvider, setServiceProvider] = useState("");
  const [service, setService] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const providerRes = await fetchWithAuth("/api/provider/garage");

        if (providerRes.status === 200) {
          const providersData = await providerRes.body;
          setServiceProviders(providersData);
        }
      } catch (err) {
        setError("Error fetching service providers");
      }
    };

    fetchProviders();
  }, []);

  // When service provider changes, filter the services
  useEffect(() => {
    if (serviceProvider) {
      const selectedProvider = serviceProviders.find((p) => p.id === parseInt(serviceProvider));

      if (selectedProvider) {
        setFilteredServices(selectedProvider.services || []);
        setService(""); // Reset service selection
      }
    } else {
      setFilteredServices([]);
    }
  }, [serviceProvider, serviceProviders]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchWithAuth("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          userId: 1, // Replace with actual user ID from auth context
          serviceProviderId: parseInt(serviceProvider),
          serviceId: parseInt(service),
          scheduledAt: new Date(scheduledAt).toISOString(),
          status: "PENDING",
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setSuccess("Booking added successfully!");
        setTimeout(() => router.push("/bookings"), 1500);
      } else {
        setError("Failed to add booking");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">Add Booking</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Select Service Provider */}
            <div>
              <label className="block text-gray-700">Select Service Provider</label>
              <select
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              >
                <option value="" disabled>Select a provider</option>
                {serviceProviders.map((provider) => (
                  <option key={provider.id} value={provider.id}>
                    {provider.businessName}
                  </option>
                ))}
              </select>
            </div>

            {/* Select Service */}
            <div>
              <label className="block text-gray-700">Select Service</label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
                disabled={!filteredServices.length}
              >
                <option value="" disabled>Select a service</option>
                {filteredServices.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Schedule Date & Time */}
            <div>
              <label className="block text-gray-700">Schedule Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Booking"}
            </button>
          </form>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default AddBooking;
