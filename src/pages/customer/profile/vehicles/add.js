import { useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../../utils/api";
import Navbar from "../../../components/Navbar";
import SidebarSettings from "../../../components/SidebarSettings"; 
import FileUpload from "../../../components/FileUpload";
import { Save, ArrowLeft } from "lucide-react";

const AddVehicle = () => {
  const [formData, setFormData] = useState({
    vehicleNo: "",
    vin: "",
    make: "",
    model: "",
    year: "",
    pic: "",
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpload = (fileUrl) => {
    setFormData({ ...formData, pic: fileUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { status, body } = await fetchWithAuth("/api/vehicle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (status === 201) {
      alert("✅ Vehicle added successfully!");
      router.push("/profile/vehicles");
    } else {
      alert(`❌ Error: ${body.message}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto flex mt-16 px-4">
        {/* Sidebar */}
        <SidebarSettings />

        {/* Add Vehicle Form */}
        <div className="w-3/4 bg-white p-6 rounded-lg shadow-md">
          {/* Page Header */}
          <div className="flex justify-between items-center border-b pb-3">
            <h2 className="text-xl font-semibold text-gray-900">Add New Vehicle</h2>
            <button
              onClick={() => router.push("/profile/vehicles")}
              className="p-1 rounded-full hover:bg-gray-200 transition"
            >
              <ArrowLeft className="w-4 h-4 text-blue-600" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-3">
            {/* Compact Inputs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">Registration No</label>
                <input
                  type="text"
                  name="vehicleNo"
                  value={formData.vehicleNo}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">VIN</label>
                <input
                  type="text"
                  name="vin"
                  value={formData.vin}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">Make</label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-gray-600 text-sm font-medium">Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
              <div className="flex flex-col col-span-2">
                <label className="text-gray-600 text-sm font-medium">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-200 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Upload Vehicle Image */}
            <div className="flex flex-col">
              <label className="text-gray-600 text-sm font-medium">Vehicle Image</label>
              <FileUpload onUpload={handleUpload} />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white text-sm rounded-md shadow-md hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              <Save className="w-4 h-4" />
              <span>Save Vehicle</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;
