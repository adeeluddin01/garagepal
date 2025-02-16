import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Fetch helper with auth token
import ProviderLayout from "../../../components/ProviderLayout";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        const response = await fetchWithAuth(`/api/provider/employees`, { method: "GET" });
        const data = await response.body;
        setEmployees(data);
      } catch (err) {
        setError("Failed to load employees. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return (
    <ProviderLayout>
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold text-indigo-600 mb-6">Your Employees</h1>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {loading ? (
          <div className="text-indigo-600">Loading employees...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {employees.length > 0 ? (
              employees.map((employee) => (
                <div key={employee.id} className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <img
                    src="/path/to/employee-image.jpg" // Replace with actual employee image URL
                    alt={employee.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-2xl font-semibold text-indigo-600">{employee.name}</h3>
                    <p className="text-gray-600">Employee of Garage: {employee.serviceProvider.businessName}</p>
                    <button
                      onClick={() => router.push(`/provider/employees/view/${employee.id}`)}
                      className="mt-4 py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No employees found.</p>
            )}
          </div>
        )}
      </div>
    </ProviderLayout>
  );
};

export default EmployeeList;
