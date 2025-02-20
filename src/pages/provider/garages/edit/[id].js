import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../../utils/api"; // Import the fetchWithAuth utility
import ProviderLayout from "../../../../components/ProviderLayout";
import FileUpload from "../../../../components/FileUpload";

const EditGarage = () => {
  const router = useRouter();
  const { id } = router.query; // Get the garage ID from the URL
  const [garage, setGarage] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phoneNumber: "",
    businessName: "",
    ownerName: "",
    location: "",
    latitude: "",
    longitude: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch garage details on load
  useEffect(() => {
    if (id) {
      const fetchGarageDetails = async () => {
        try {
          const response = await fetchWithAuth(`/api/provider/garage/${id}`);
          if (!response.status >= 200) {
            throw new Error("Failed to fetch garage details");
          }
          const data = await response.body;
          setGarage(data);
          setFormData({
            email: data.email,
            password: "", // Keep password empty on edit
            phoneNumber: data.phoneNumber,
            businessName: data.businessName,
            ownerName: data.ownerName,
            location: data.location,
            latitude: data.latitude,
            longitude: data.longitude,
            avatar: data.avatar,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };

      fetchGarageDetails();
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const updatedGarage = await fetchWithAuth(`/api/provider/garage/${id}`, {
        method: "PUT",
        body: JSON.stringify(formData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Update successful:", updatedGarage);

    // ✅ Redirect only after successful update
    router.push(`/provider/garages/view/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleUpload = (fileUrl) => {
    setFormData({ ...formData, avatar: fileUrl });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (<ProviderLayout>
    <div className="container mx-auto p-5">
      <h1 className="text-3xl font-bold mb-4">Edit Garage</h1>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="businessName" className="block text-lg font-semibold">
              Business Name
            </label>
            <input
              type="text"
              id="businessName"
              name="businessName"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="ownerName" className="block text-lg font-semibold">
              Owner Name
            </label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="location" className="block text-lg font-semibold">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="latitude" className="block text-lg font-semibold">
              Latitude
            </label>
            <input
              type="text"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="longitude" className="block text-lg font-semibold">
              Longitude
            </label>
            <input
              type="text"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-lg font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phoneNumber" className="block text-lg font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-lg font-semibold">
              Password (Leave blank to keep the same)
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-2 border rounded-md"
            />
          </div>
          {/* Upload Garage Image */}
          <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-medium">Garage Image</label>
              <FileUpload onUpload={handleUpload} />
          </div>

          <div className="mb-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
            >
              {isSubmitting ? "Updating..." : "Update Garage"}
            </button>
          </div>
        </form>
      </div>
    </div>

    </ProviderLayout>
  );
};

export default EditGarage;
