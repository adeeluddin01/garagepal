import { useState } from "react";
import { useRouter } from "next/router";
import { FaUserPlus, FaEnvelope, FaPhone, FaMapMarkerAlt, FaSun, FaMoon } from "react-icons/fa";
import ProviderLayout from "@/components/ProviderLayout";
import FileUpload from "@/components/FileUpload"; // Import File Upload Component

export default function AddCustomer() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [avatar, setAvatar] = useState(""); // Store uploaded avatar URL
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phoneNumber || !latitude || !longitude) {
      alert("Please fill all fields.");
      return;
    }

    const response = await fetch("/api/provider/customer-onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, phoneNumber, latitude, longitude, customerAvatar: avatar }),
    });

    if (response.ok) {
      router.push("/provider/customer-onboarding");
    } else {
      alert("Failed to add customer.");
    }
  };

  return (
    <ProviderLayout>
      <div className={`p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} rounded-lg shadow-lg max-w-2xl mx-auto`}>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <FaUserPlus className="mr-2 text-indigo-600" />
            Add New Customer
          </h1>

          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 flex items-center">
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* File Upload for Avatar */}
        <FileUpload onUpload={setAvatar} />

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-800">
              <FaUserPlus className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-800">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-800">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="text"
                placeholder="Enter phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Latitude & Longitude */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-1 font-semibold">Latitude</label>
              <div className="flex items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-800">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="w-1/2">
              <label className="block mb-1 font-semibold">Longitude</label>
              <div className="flex items-center border rounded-md p-2 bg-gray-100 dark:bg-gray-800">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  required
                  className="w-full bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-600 text-white p-2 rounded-md hover:bg-green-700 flex items-center justify-center"
          >
            <FaUserPlus className="mr-2" />
            Add Customer
          </button>
        </form>
      </div>
    </ProviderLayout>
  );
}