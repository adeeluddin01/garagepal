import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../../../utils/api";
import { useRouter } from "next/router";
import Navbar from "../../../../components/Navbar";
import SidebarSettings from "../../../../components/SidebarSettings";
import FileUpload from "../../../../components/FileUpload";
import { Save, ArrowLeft } from "lucide-react";

const EditVehicle = () => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    const fetchVehicle = async () => {
      const { status, body } = await fetchWithAuth(`/api/vehicle/${id}`);
      if (status === 200) {
        setVehicle(body.vehicle);
      }
      setLoading(false);
    };

    fetchVehicle();
  }, [id]);

  const handleChange = (e) => {
    setVehicle({ ...vehicle, [e.target.name]: e.target.value });
  };

  const handleUpload = (fileUrl) => {
    setVehicle({ ...vehicle, pic: fileUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { status, body } = await fetchWithAuth(`/api/vehicle/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(vehicle),
    });

    if (status === 200) {
      alert("✅ Vehicle updated successfully!");
      router.push("/profile/vehicles");
    } else {
      alert(`❌ Error: ${body.message}`);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto flex mt-20 px-6">
        {/* Sidebar */}
        <SidebarSettings />

        {/* Main Content */}
        <div className="w-3/4">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform transition-all">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Vehicle
              </h2>
              <button
                onClick={() => router.push("/profile/vehicles")}
                className="flex items-center text-green-600 hover:text-green-800"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Vehicles
              </button>
            </div>

            {/* Vehicle Image */}
            <div className="flex items-center space-x-4">
              <div className="relative w-28 h-28 rounded-lg border-4 border-gray-200 shadow-md">
                <img
                  src={vehicle?.pic || "/default-vehicle.png"}
                  alt="Vehicle"
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{vehicle?.make} {vehicle?.model}</h3>
                <p className="text-gray-500">Year: {vehicle?.year}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Vehicle Registration No */}
                <div>
                  <label className="block text-gray-700 font-medium">Registration No:</label>
                  <input
                    type="text"
                    name="vehicleNo"
                    value={vehicle?.vehicleNo}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>

                {/* VIN */}
                <div>
                  <label className="block text-gray-700 font-medium">VIN:</label>
                  <input
                    type="text"
                    name="vin"
                    value={vehicle?.vin}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>

                {/* Make */}
                <div>
                  <label className="block text-gray-700 font-medium">Make:</label>
                  <input
                    type="text"
                    name="make"
                    value={vehicle?.make}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>

                {/* Model */}
                <div>
                  <label className="block text-gray-700 font-medium">Model:</label>
                  <input
                    type="text"
                    name="model"
                    value={vehicle?.model}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>

                {/* Year */}
                <div>
                  <label className="block text-gray-700 font-medium">Year:</label>
                  <input
                    type="number"
                    name="year"
                    value={vehicle?.year}
                    onChange={handleChange}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* File Upload */}
              <div className="mt-2">
                <label className="block text-gray-700 font-medium">Upload Image:</label>
                <FileUpload onUpload={handleUpload} />
              </div>

              {/* Save Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center space-x-2 px-5 py-2 bg-green-600 text-white text-lg rounded-md shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
              >
                <Save className="w-5 h-5" />
                <span>Save Changes</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVehicle;
