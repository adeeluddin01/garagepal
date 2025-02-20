import { useState } from "react";
import { useRouter } from "next/router";
import ProviderLayout from "@/components/ProviderLayout";
import { FaCar, FaPlus } from "react-icons/fa";
import FileUpload from "../../../../components/FileUpload"

export default function AddVehicle() {
  const router = useRouter();
  const { id } = router.query; // Customer ID from URL
  const [vehicleNo, setVehicleNo] = useState("");
  const [vin, setVin] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [pic, setPic] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const response = await fetch(`/api/provider/customer-onboarding/${id}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleNo, vin, make, model, year, pic }),
    });

    if (response.ok) {
      router.push(`/provider/customer-onboarding`);
    } else {
      const errorData = await response.json();
      setError(errorData.error || "Failed to add vehicle");
    }
  };

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto">
        <h1 className="text-2xl font-bold flex items-center">
          <FaCar className="mr-2 text-indigo-600" /> Add Vehicle
        </h1>
        {error && <p className="text-red-600">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input type="text" placeholder="Vehicle No" value={vehicleNo} onChange={(e) => setVehicleNo(e.target.value)} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="VIN" value={vin} onChange={(e) => setVin(e.target.value)} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="Make" value={make} onChange={(e) => setMake(e.target.value)} required className="w-full p-2 border rounded" />
          <input type="text" placeholder="Model" value={model} onChange={(e) => setModel(e.target.value)} required className="w-full p-2 border rounded" />
          <input type="number" placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} required className="w-full p-2 border rounded" />
          <FileUpload onUpload={setPic} />
          <button type="submit" className="bg-green-600 text-white p-2 rounded-md hover:bg-green-700 flex items-center">
            <FaPlus className="mr-2" /> Add Vehicle
          </button>
        </form>
      </div>
    </ProviderLayout>
  );
}