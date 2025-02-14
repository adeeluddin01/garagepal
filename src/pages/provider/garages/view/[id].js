import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../../utils/api";
import ProviderLayout from "../../../../components/ProviderLayout";

const GarageView = () => {
  const router = useRouter();
  const { id } = router.query;
  const [garage, setGarage] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form states for adding a service and sub-service
  const [newService, setNewService] = useState({ name: "", description: "" });
  const [newSubService, setNewSubService] = useState({ serviceId: "", name: "", description: "", cost: "" });
  const [isAddingSubService, setIsAddingSubService] = useState(false); // Track if the input is visible

  useEffect(() => {
    if (id) {
      const fetchGarageDetails = async () => {
        try {
          const response = await fetchWithAuth(`/api/provider/garage/${id}`);
          if (!response.status == 201) {
            throw new Error("Failed to fetch garage details");
          }
          const data = await response.body;
          console.log(data);
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

      if (!response.status == 201) {
        throw new Error("Failed to add service");
      }

      const addedService = await response.body;
      setServices((prev) => [...prev, addedService]);
      setNewService({ name: "", description: "" });
    } catch (err) {
      alert(err.message);
    }
  };

  const addSubService = async (serviceId) => {
    try {
      const response = await fetchWithAuth(`/api/provider/subservice`, {
        method: "POST",
        body: JSON.stringify({
          serviceId,
          name: newSubService.name,
          description: newSubService.description, // Include description
          cost: parseInt(newSubService.cost), // Include cost
        }),
      });
  
      if (response.status !== 201) {
        throw new Error("Failed to add sub-service");
      }
  
      const addedSubService = await response.body;
      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? { ...service, subServices: [...(service.subServices || []), addedSubService] }
            : service
        )
      );
      setNewSubService({ serviceId: "", name: "", description: "", cost: "" }); // Reset input fields
    } catch (err) {
      alert(err.message);
    }
  };
  
  

  const deleteService = async (serviceId) => {
    try {
      const response = await fetchWithAuth(`/api/provider/service/${serviceId}`, {
        method: "DELETE",
      });

      if (!response.status === 200) {
        throw new Error("Failed to delete service");
      }

      setServices((prev) => prev.filter((service) => service.id !== serviceId));
    } catch (err) {
      alert(err.message);
    }
  };

  const deleteSubService = async (serviceId, subServiceId) => {
    try {
      const response = await fetchWithAuth(`/api/provider/subservice/${subServiceId}`, {
        method: "DELETE",
      });

      if (!response.status === 200) {
        throw new Error("Failed to delete sub-service");
      }

      setServices((prev) =>
        prev.map((service) =>
          service.id === serviceId
            ? { ...service, subServices: service.subServices.filter((subService) => subService.id !== subServiceId) }
            : service
        )
      );
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubServiceToggle = (serviceId) => {
    setIsAddingSubService((prev) => (prev === serviceId ? false : serviceId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!garage) return <div>Garage not found</div>;

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

          {/* Services Section */}
          <h2 className="text-2xl font-semibold mb-3">Services</h2>
          <div className="flex flex-wrap gap-6">
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white shadow rounded-lg p-6 w-full lg:w-full xl:w-full relative"
                >
                  <h3 className="text-xl font-bold">{service.name}</h3>
                  <p className="text-sm text-gray-600 mt-2">{service.description}</p>

                  {/* Delete Service Button */}
                  <button
                    onClick={() => deleteService(service.id)}
                    className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                  >
                    X
                  </button>

                  {/* SubServices */}
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold">Sub-Services</h4>
                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {Array.isArray(service.subServices) && service.subServices.length > 0 ? (
                        service.subServices.map((subService) => (
                          <div
                            key={subService.id}
                            className="flex items-center bg-gray-100 p-4 rounded-lg mb-3 relative"
                          >
                            <div className="w-16 h-16 bg-gray-200 rounded-md mr-4">
                              {/* Placeholder for thumbnail */}
                            </div>
                            <div className="flex-1">
  <h5 className="font-semibold">{subService.name}</h5>
  <p className="text-sm text-gray-600">{subService.description}</p>
  <p className="text-sm font-semibold text-indigo-600">Cost: {subService.cost}</p>
</div>


                            {/* Delete SubService Button */}
                            <button
                              onClick={() => deleteSubService(service.id, subService.id)}
                              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
                            >
                              X
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No sub-services</p>
                      )}
                    </div>
                  </div>

                  {/* Floating Add SubService Button */}
                  <button
                    onClick={() => handleSubServiceToggle(service.id)}
                    className="absolute bottom-3 right-3 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
                  >
                    +
                  </button>

                  {/* Conditionally Render SubService Input */}
                  {isAddingSubService === service.id && (
  <div className="mt-3 flex flex-wrap gap-2">
    <input
      type="text"
      placeholder="SubService Name"
      value={newSubService.serviceId === service.id ? newSubService.name : ""}
      onChange={(e) =>
        setNewSubService((prev) => ({ ...prev, serviceId: service.id, name: e.target.value }))
      }
      className="border p-2 rounded-md w-1/4"
    />
    <input
      type="text"
      placeholder="Description"
      value={newSubService.serviceId === service.id ? newSubService.description : ""}
      onChange={(e) =>
        setNewSubService((prev) => ({ ...prev, serviceId: service.id, description: e.target.value }))
      }
      className="border p-2 rounded-md w-1/3"
    />
    <input
      type="number"
      placeholder="Cost"
      value={newSubService.serviceId === service.id ? newSubService.cost : ""}
      onChange={(e) =>
        setNewSubService((prev) => ({ ...prev, serviceId: service.id, cost: e.target.value }))
      }
      className="border p-2 rounded-md w-1/6"
    />
    <button
      onClick={() => addSubService(service.id)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
    >
      Add
    </button>
  </div>
)}


                </div>
              ))
            ) : (
              <p className="text-gray-500">No services available</p>
            )}
          </div>

          {/* Add Service */}
          <h2 className="text-2xl font-semibold mt-6">Add Service</h2>
          <div className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Service Name"
              value={newService.name}
              onChange={(e) => setNewService((prev) => ({ ...prev, name: e.target.value }))}
              className="border p-2 rounded-md w-1/3"
            />
            <input
              type="text"
              placeholder="Service Description"
              value={newService.description}
              onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
              className="border p-2 rounded-md w-1/3"
            />
            <button
              onClick={addService}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add Service
            </button>
          </div>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default GarageView;
