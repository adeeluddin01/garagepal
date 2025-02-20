import { useState, useEffect } from "react";
import Link from "next/link";
import { FaUserPlus, FaEdit, FaTrash, FaSun, FaMoon, FaCar, FaUserCircle } from "react-icons/fa"; // Icons
import ProviderLayout from "@/components/ProviderLayout";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [darkMode, setDarkMode] = useState(false); // Dark mode state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/provider/customer-onboarding");
        if (!response.ok) throw new Error("Failed to fetch customers");
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
        console.error("Error fetching customers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  console.log(customers)

  return (
    <ProviderLayout>
      <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-lg shadow-lg`}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUserPlus className="mr-2 text-indigo-600" />
            Customer List
          </h1>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center"
          >
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Add Customer Button */}
          <Link href="/provider/customer-onboarding/add">
            <button className="p-2 rounded-md bg-green-600 text-white hover:bg-green-700 flex items-center">
              <FaUserPlus className="mr-2" />
              Add Customer
            </button>
          </Link>
        </div>

        {/* Display Loading or Error Messages */}
        {loading && <p className="text-center text-indigo-600">Loading customers...</p>}
        {error && <p className="text-center text-red-600">{error}</p>}

        {/* Table of Customers */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left border border-gray-300">Avatar</th>
                <th className="p-3 text-left border border-gray-300">Name</th>
                <th className="p-3 text-left border border-gray-300">Email</th>
                <th className="p-3 text-left border border-gray-300">Phone</th>
                <th className="p-3 text-left border border-gray-300">Vehicles</th> {/* New Column */}
                <th className="p-3 text-left border border-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && !loading ? (
                <tr>
                  <td colSpan="6" className="text-center p-4">No customers found.</td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                    {/* Avatar */}
                    <td className="p-3 border border-gray-300">
                      {customer.customerAvatar ? (
                        <img
                          src={customer.customerAvatar}
                          alt="Customer Avatar"
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}
                    </td>

                    {/* Customer Details */}
                    <td className="p-3 border border-gray-300">{customer.name}</td>
                    <td className="p-3 border border-gray-300">{customer.email || "N/A"}</td>
                    <td className="p-3 border border-gray-300">{customer.phoneNumber || "N/A"}</td>

                    {/* Vehicles Count */}
                    <td className="p-3 border border-gray-300 text-center">
                      {customer.vehicles ? customer.vehicles.length : 0}
                    </td>

                    {/* Actions */}
                    <td className="p-3 border border-gray-300 flex space-x-2">
                      
                      {/* Add Vehicle Button */}
                      <Link href={`/provider/customer-onboarding/${customer.id}/add-vehicle`}>
                        <button className="p-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 flex items-center">
                          <FaCar className="mr-1" /> Add Vehicle
                        </button>
                      </Link>
                      {/* Edit Button */}
                      <Link href={`/provider/customer-onboarding/${customer.id}`}>
                        <button className="p-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center">
                          <FaEdit className="mr-1" /> Edit
                        </button>
                      </Link>

                      

                      {/* Delete Button */}
                      <button className="p-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center">
                        <FaTrash className="mr-1" /> Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </ProviderLayout>
  );
}