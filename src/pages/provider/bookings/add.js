import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api";
import ProviderLayout from "../../../components/ProviderLayout";

const AddBooking = () => {
  const [serviceProvider, setServiceProvider] = useState("");
  const [subService, setSubService] = useState("");
  const [subServiceCost, setSubServiceCost] = useState(0);
  const [employee, setEmployee] = useState("");
  const [scheduledAt, setScheduledAt] = useState("");
  const [serviceProviders, setServiceProviders] = useState([]);
  const [filteredSubServices, setFilteredSubServices] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);



  const [customerQuery, setCustomerQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [customer, setCustomer] = useState(null);
  

  const [selectedVehicle, setSelectedVehicle] = useState("");


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

  useEffect(() => {
    if (serviceProvider) {
      const selectedProvider = serviceProviders.find((p) => p.id === parseInt(serviceProvider));

      if (selectedProvider) {
        const allSubServices = selectedProvider.services?.flatMap((service) =>
          service.subServices?.map((sub) => ({
            ...sub,
            serviceName: service.name,
            cost: sub.cost ?? 0, // Default cost to 0 if missing
          })) || []
        );

        setFilteredSubServices(allSubServices || []);
        setFilteredEmployees(selectedProvider.employees || []);
        setSubService(""); // Reset subservice selection
        setSubServiceCost(0); // Reset cost
        setEmployee(""); // Reset employee selection
      }
    } else {
      setFilteredSubServices([]);
      setFilteredEmployees([]);
    }
  }, [serviceProvider, serviceProviders]);

  const handleSubServiceChange = (e) => {
    const selectedSubServiceId = e.target.value;
    setSubService(selectedSubServiceId);

    // Find the selected subservice to get its cost
    const selectedSubService = filteredSubServices.find((sub) => sub.id === parseInt(selectedSubServiceId));
    setSubServiceCost(selectedSubService ? selectedSubService.cost : 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    console.log({
        userId: 1, // Replace with actual user ID from auth context
        serviceProviderId: parseInt(serviceProvider),
        subServiceId: parseInt(subService),
        subServiceCost, // Include cost in request
        employeeId: employee ? parseInt(employee) : null,
        scheduledAt: new Date(scheduledAt).toISOString(),
        status: "PENDING",
        customerId: parseInt(customer.id),
        vehicleId: parseInt(selectedVehicle), // 🔥 Now sending vehicleId


      })
      console.log(customer)
    try {
      const response = await fetchWithAuth("/api/provider/bookings", {
        method: "POST",
        body: JSON.stringify({
          userId: 1, // Replace with actual user ID from auth context
          serviceProviderId: parseInt(serviceProvider),
          subServiceId: parseInt(subService),
          customerId: parseInt(customer.id),
          subServiceCost, // Include cost in request
          employeeId: employee ? parseInt(employee) : null,
          scheduledAt: new Date(scheduledAt).toISOString(),
          status: "PENDING",
          vehicleId: selectedVehicle ? parseInt(selectedVehicle) : null, // ✅ Now sending vehicleId
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


  const handleCustomerSearch = async () => {
    if (!customerQuery) {
      setError("Enter phone or email to search");
      return;
    }
  
    setError(null);
    setLoading(true);
  
    // Function to detect if the input is an email or phone number
    const detectInputType = (input) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{10,15}$/;
  
      if (emailRegex.test(input)) return "email";
      if (phoneRegex.test(input)) return "phoneNumber";
      return "unknown";
    };
  
    const inputType = detectInputType(customerQuery);
    if (inputType === "unknown") {
      setError("Invalid input. Please enter a valid phone number or email.");
      setLoading(false);
      return;
    }
  
    try {
      const queryParam = inputType === "email" ? `email=${customerQuery}` : `phoneNumber=${customerQuery}`;
      const response = await fetchWithAuth(`/api/provider/user?${queryParam}`);
      const data = await response.body;
  
      if (response.status == 200) {
        setCustomers(data);
      } else {
        setError("Customer not found");
      }
    } catch (err) {
      setError("Error fetching customer");
    } finally {
      setLoading(false);
    }
  };
  
  const handleSelectCustomer = (selectedCustomer) => {
    setCustomer(selectedCustomer);
    setCustomers([]);
  };
  

  return (
    <ProviderLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">Add Booking</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">

          <div>
  <label className="block text-gray-700">Search Customer</label>
  <div className="flex space-x-2">
    <input
      type="text"
      value={customerQuery}
      onChange={(e) => setCustomerQuery(e.target.value)}
      placeholder="Enter phone or email"
      className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
    />
    <button
      type="button"
      onClick={handleCustomerSearch}
      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
    >
      Find
    </button>
  </div>
</div>
{customer && (
  <div className="mt-4 p-3 border rounded-md bg-gray-100">
    <h2 className="text-lg font-semibold text-gray-700">Selected Customer</h2>
    <p className="font-medium">{customer.name}</p>
    <p className="text-sm text-gray-500">{customer.email} - {customer.phone}</p>
    {customer.vehicles.length > 0 ? (
      <div className="mt-2">
        <label className="block text-gray-700">Select Vehicle</label>
        <select
          value={selectedVehicle}
          onChange={(e) => setSelectedVehicle(e.target.value)}
          className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
        >
          <option value="" disabled>Select a vehicle</option>
          {customer.vehicles.map((veh) => (
            <option key={veh.id} value={veh.id}>
              {veh.make} {veh.model} - {veh.year}
            </option>
          ))}
        </select>
      </div>
    ) : (
      <p className="text-sm text-red-500">No vehicles found for this customer.</p>
    )}
  </div>
)}

{customers.length > 0 && (
  <div className="mt-3">
    <h2 className="text-lg font-semibold text-gray-700">Select Customer</h2>
    <div className="space-y-2">
      {customers.map((cust) => (
        <div
          key={cust.id}
          className="p-3 border rounded-md cursor-pointer hover:bg-gray-200"
          onClick={() => handleSelectCustomer(cust)}
        >
          <p className="font-medium">{cust.name}</p>
          <p className="text-sm text-gray-500">{cust.email} - {cust.phone}</p>
        </div>
      ))}
    </div>
  </div>
)}


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

            {/* Select SubService */}
            <div>
              <label className="block text-gray-700">Select Subservice</label>
              <select
                value={subService}
                onChange={handleSubServiceChange}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
                disabled={!filteredSubServices.length}
              >
                <option value="" disabled>Select a subservice</option>
                {filteredSubServices.length > 0 &&
                  [...new Set(filteredSubServices.map((s) => s.serviceName))].map((serviceName) => (
                    <optgroup key={serviceName} label={serviceName}>
                      {filteredSubServices
                        .filter((sub) => sub.serviceName === serviceName)
                        .map((sub) => (
                          <option key={sub.id} value={sub.id}>
                            {sub.name} - ${sub.cost}
                          </option>
                        ))}
                    </optgroup>
                  ))}
              </select>
            </div>

            {/* Display Cost */}
            <div>
              <label className="block text-gray-700">Selected Subservice Cost</label>
              <input
                type="text"
                value={`$${subServiceCost}`}
                disabled
                className="w-full p-2 border bg-gray-100 rounded-md"
              />
            </div>

            {/* Select Employee (Optional) */}
            <div>
              <label className="block text-gray-700">Assign Employee</label>
              <select
                value={employee}
                onChange={(e) => setEmployee(e.target.value)}
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
                disabled={!filteredEmployees.length}
              >
                <option value="">Select an employee (optional)</option>
                {filteredEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
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
