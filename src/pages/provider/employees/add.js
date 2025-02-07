import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Utility for auth fetch
import ProviderLayout from "../../../components/ProviderLayout";

const AddEmployee = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetchWithAuth("/api/provider/employees", {
        method: "POST",
        body: JSON.stringify({ name }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 201) {
        setSuccess("Employee added successfully!");
        setName(""); // Clear form
        setTimeout(() => router.push("/provider/employees"), 1500); // Redirect after success
      } else {
        const errorData = await response.body;
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
