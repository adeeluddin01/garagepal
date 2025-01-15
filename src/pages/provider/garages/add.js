import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api"; // Import the fetchWithAuth utility
import ProviderLayout from "../../../components/ProviderLayout";

const AddServiceProvider = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    ownerName: "",
    location: "",
    latitude: "",
    longitude: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetchWithAuth("/api/provider/garage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    //   alert(response.status)
      if (response.status == 201) {
        router.push("/provider/garages"); // Redirect to the garages list page after successful creation
      } else {
        setError("Failed to create the garage. Please try again.");
      }
    } catch (err) {
      setError("Failed to create the garage. Please try again. authfetch");
    } finally {
      setLoading(false);
    }
  };

  return (
<ProviderLayout>

    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-3xl font-bold text-indigo-600 mb-6">Add New Garage</h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="phoneNumber">
            Phone Number
          </label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="businessName">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="ownerName">
            Owner Name
          </label>
          <input
            type="text"
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700" htmlFor="location">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="w-full p-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex">
          <div className="mr-2 w-1/2">
            <label className="block text-gray-700" htmlFor="latitude">
              Latitude
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>

          <div className="w-1/2">
            <label className="block text-gray-700" htmlFor="longitude">
              Longitude
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleChange}
              required
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {loading ? "Adding Garage..." : "Add Garage"}
          </button>
        </div>
      </form>
    </div>


    </ProviderLayout>
  );
};

export default AddServiceProvider;
