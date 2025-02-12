import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Utility for auth fetch
import ProviderLayout from "../../../components/ProviderLayout";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [serviceProvider, setServiceProvider] = useState(""); // Selected garage ID
  const [garages, setGarages] = useState([]); // List of garages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter();

  // Fetch garages when component mounts
  useEffect(() => {
    const fetchGarages = async () => {
      try {
        const response = await fetchWithAuth("/api/provider/garage");
        console.log(typeof response.status)
        if (response.status != 200 ) console.log("Failed to fetch garages");
        const data = await response.body;
        setGarages(data);
      } catch (err) {
        setError("Error fetching garages");
      }
    };

    fetchGarages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchWithAuth("/api/provider/employees", {
        method: "POST",
        body: JSON.stringify({ name, serviceProviderId:parseInt(serviceProvider) }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setSuccess("Employee added successfully!");
        setName("");
        setServiceProvider(""); // Reset form
        setTimeout(() => router.push("/provider/employees"), 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Failed to add employee.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h1 className="text-2xl font-bold text-indigo-600 mb-4">Add Employee</h1>

          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700">Employee Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              />
            </div>

            <div>
              <label className="block text-gray-700">Select Garage</label>
              <select
                value={serviceProvider}
                onChange={(e) => setServiceProvider(e.target.value)}
                required
                className="w-full p-2 border rounded-md focus:ring focus:ring-indigo-300"
              >
                <option value="" disabled>Select a garage</option>
                {garages.map((garage) => (
                  <option key={garage.id} value={garage.id}>
                    {garage.businessName}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Employee"}
            </button>
          </form>
        </div>
      </div>
    </ProviderLayout>
  );
};

export default AddEmployee;
