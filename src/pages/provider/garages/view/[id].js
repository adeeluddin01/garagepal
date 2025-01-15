import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../../utils/api"; // Import the fetchWithAuth utility
import ProviderLayout from "../../../../components/ProviderLayout";

const GarageView = () => {
  const router = useRouter();
  const { id } = router.query; // Get the garage ID from the URL
  const [garage, setGarage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for adding a service and sub-service
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [newSubService, setNewSubService] = useState({ serviceId: "", name: "" });

  useEffect(() => {
    if (id) {
      const fetchGarageDetails = async () => {
        try {
          const response = await fetchWithAuth(`/api/provider/garage/${id}`);
          if (!response.status == 201) {
            throw new Error("Failed to fetch garage details");
          }
          const data = await response.body;
          setGarage(data);
          setServices(data.services); // Assuming `services` is part of the garage response
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchGarageDetails();
    }
  }, [id]);

  const addService = async () => {
    try {
      const response = await fetchWithAuth(`/api/provider/service`, {
        method: "POST",
        body: JSON.stringify({
          serviceProviderId: id,
          name: newService.name,
          description: newService.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      const addedService = await response.json();
      setServices((prev) => [...prev, addedService]);
      setNewService({ name: "", description: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const addSubService = async () => {
    try {
      const response = await fetchWithAuth(`/api/provider/subservice`, {
        method: "POST",
        body: JSON.stringify({
          serviceId: newSubService.serviceId,
          name: newSubService.name,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add sub-service");
      }

      const addedSubService = await response.body;
      setServices((prev) =>
        prev.map((service) =>
          service.id === newSubService.serviceId
            ? { ...service, subServices: [...service.subServices, addedSubService] }
            : service
        )
      );
      setNewSubService({ serviceId: "", name: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!garage) {
    return <div>Garage not found</div>;
  }

  return (
    <ProviderLayout>
      <div className="container mx-auto p-5">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-4">{garage.businessName}</h1>
          <p className="text-xl mb-2">Owner: {garage.ownerName}</p>
          <p className="text-lg mb-2">Location: {garage.location}</p>
          <p className="text-sm text-gray-600 mb-4">
            Coordinates: {garage.latitude}, {garage.longitude}
          </p>

          {/* Services Offered */}
          <h2 className="text-2xl font-semibold mb-3">Services</h2>
          <ul className="list-disc pl-5">
            {services.map((service) => (
              <li key={service.id} className="mb-4">
                <strong>{service.name}:</strong> {service.description}
                <ul className="list-disc pl-8 mt-2">
                  {service.subServices.map((subService) => (
                    <li key={subService.id}>{subService.name}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Add Service */}
          <h2 className="text-2xl font-semibold mt-6">Add Service</h2>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
              className="border p-2 rounded-md mr-2"
            />
            <input
              type="text"
              placeholder="Service Description"
              value={newService.description}
              onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
              className="border p-2 rounded-md mr-2"
            />
            <button
              onClick={addService}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Service
            </button>
          </div>

          {/* Add SubService */}
          <h2 className="text-2xl font-semibold mt-6">Add SubService</h2>
          <div className="mt-4">
            <select
              value={newSubService.serviceId}
              onChange={(e) => setNewSubService((prev) => ({ ...prev, serviceId: parseInt(e.target.value) }))}
              className="border p-2 rounded-md mr-2"
            >
              <option value="">Select Service</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="SubService Name"
              value={newSubService.name}
              onChange={(e) => setNewSubService((prev) => ({ ...prev, name: e.target.value }))}
              className="border p-2 rounded-md mr-2"
            />
            <button
              onClick={addSubService}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add SubService
            </button>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default GarageView;
