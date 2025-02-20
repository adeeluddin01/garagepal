import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProviderLayout from "@/components/ProviderLayout";
import FileUpload from "@/components/FileUpload"; // File Upload Component

export default function EditVehicle() {
  const [vehicle, setVehicle] = useState(null);
  const [newImage, setNewImage] = useState(""); // Store new uploaded image URL
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (id) {
      fetch(`/api/provider/vehicles/${id}`)
        .then((res) => res.json())
        .then((data) => setVehicle(data));
    }
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const updatedVehicle = { ...vehicle, pic: newImage || vehicle.pic };

    const response = await fetch(`/api/provider/vehicles/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedVehicle),
    });

    if (response.ok) router.push("/provider/vehicles");
  };

  if (!vehicle) return <p className="text-center text-indigo-600">Loading...</p>;

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold">Edit Vehicle</h1>

        {/* Vehicle Image Preview */}
        <div className="mt-4 flex flex-col items-center">
          {vehicle.pic ? (
            <img src={vehicle.pic} alt="Vehicle" className="w-40 h-40 object-cover rounded-lg border" />
          ) : (
            <p className="text-gray-500">No image available</p>
          )}
        </div>

        {/* File Upload Component */}
        <FileUpload onUpload={setNewImage} />

        {/* Vehicle Edit Form */}
        <form onSubmit={handleUpdate} className="space-y-4 mt-4">
          <input type="text" value={vehicle.vehicleNo} onChange={(e) => setVehicle({ ...vehicle, vehicleNo: e.target.value })} className="w-full p-2 border rounded" />
          <input type="text" value={vehicle.make} onChange={(e) => setVehicle({ ...vehicle, make: e.target.value })} className="w-full p-2 border rounded" />
          <input type="text" value={vehicle.model} onChange={(e) => setVehicle({ ...vehicle, model: e.target.value })} className="w-full p-2 border rounded" />
          <input type="number" value={vehicle.year} onChange={(e) => setVehicle({ ...vehicle, year: e.target.value })} className="w-full p-2 border rounded" />

          <button type="submit" className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Update Vehicle
          </button>
        </form>
      </div>
    </ProviderLayout>
  );
}