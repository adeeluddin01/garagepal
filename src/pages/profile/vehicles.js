import { useState, useEffect } from "react";
import { fetchWithAuth } from "../../utils/api";
import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import SidebarSettings from "../../components/SidebarSettings"; // Sidebar component for reuse
import { PlusCircle, Edit, Car, Calendar, Briefcase, User } from "lucide-react";

const VehiclePage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchVehicles = async () => {
      const { status, body } = await fetchWithAuth("/api/vehicle");
      if (status === 200) setVehicles(body.vehicles);
      setLoading(false);
    };

    fetchVehicles();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto flex mt-24 px-6">
        {/* Sidebar */}
        <SidebarSettings />

        {/* Vehicle Management Section */}
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg">
          {/* Header with Title & Add Vehicle Button */}
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Manage Vehicles</h2>
            <button
              onClick={() => router.push("/profile/vehicles/add")}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              <PlusCircle className="w-5 h-5" />
              <span>Add Vehicle</span>
            </button>
          </div>

          {/* Vehicle List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            {loading ? (
              <p className="text-gray-500">Loading vehicles...</p>
            ) : vehicles.length > 0 ? (
              vehicles.map((v) => (
                <div
                  key={v.id}
                  className="relative bg-gray-50 p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300"
                >
                  {/* Edit Button - Floating on top-right */}
                  <button
                    onClick={() => router.push(`/profile/vehicles/edit/${v.id}`)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white shadow-md hover:bg-gray-200 transition"
                  >
                    <Edit className="w-5 h-5 text-green-600" />
                  </button>

                  {/* Vehicle Image */}
                  <img
                    src={v.pic || "/default-vehicle.png"}
                    alt={v.make}
                    className="w-full h-32 object-cover rounded-lg border"
                  />

                  {/* Vehicle Details */}
                  <div className="mt-3">
                    <h3 className="text-lg font-semibold text-gray-700">
                      {v.year} {v.make} {v.model}
                    </h3>
                    <p className="text-sm text-gray-500">VIN: {v.vin}</p>
                    <p className="text-sm text-gray-500">Reg #: {v.vehicleNo}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No vehicles added</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehiclePage;
