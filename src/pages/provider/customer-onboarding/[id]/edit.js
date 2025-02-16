import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ProviderLayout from "@/components/ProviderLayout";
import { FaUserEdit, FaEnvelope, FaPhone, FaMapMarkerAlt, FaArrowLeft } from "react-icons/fa";
import FileUpload from "@/components/FileUpload";

export default function EditCustomer() {
  const router = useRouter();
  const { id } = router.query;

  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    latitude: "",
    longitude: "",
    customerAvatar: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      try {
        const response = await fetch(`/api/provider/customer-onboarding/${id}`);
        if (!response.ok) throw new Error("Failed to fetch customer details");
        const data = await response.json();

        if (!data.customer) throw new Error("Customer data not found");

        setCustomer({
          name: data.customer.name || "",
          email: data.customer.email || "",
          phoneNumber: data.customer.phoneNumber || "",
          latitude: data.customer.latitude || "",
          longitude: data.customer.longitude || "",
          customerAvatar: data.customer.customerAvatar || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  // Handle File Upload
  const handleFileUpload = (fileUrl) => {
    setCustomer((prevCustomer) => ({ ...prevCustomer, customerAvatar: fileUrl }));
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/provider/customer-onboarding/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customer),
      });

      if (response.ok) {
        router.push(`/provider/customer-onboarding/${id}`);
      } else {
        throw new Error("Failed to update customer");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p className="text-center text-indigo-600">Loading...</p>;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <ProviderLayout>
      <div className="p-6 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/provider/customer-onboarding/${id}`)}
          className="text-indigo-600 flex items-center mb-4"
        >
          <FaArrowLeft className="mr-2" /> Back to Customer Details
        </button>

        <h1 className="text-2xl font-bold flex items-center mb-4">
          <FaUserEdit className="mr-2 text-indigo-600" />
          Edit Customer
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Upload */}
          <div className="text-center">
            {customer.customerAvatar ? (
              <img
                src={customer.customerAvatar}
                alt="Customer Avatar"
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
                <FaUserEdit className="text-gray-500 text-3xl" />
              </div>
            )}
            <FileUpload onUpload={handleFileUpload} />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-semibold">Name</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100">
              <FaUserEdit className="text-gray-500 mr-2" />
              <input
                type="text"
                value={customer.name}
                onChange={(e) => setCustomer((prev) => ({ ...prev, name: e.target.value }))}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-semibold">Email</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100">
              <FaEnvelope className="text-gray-500 mr-2" />
              <input
                type="email"
                value={customer.email}
                onChange={(e) => setCustomer((prev) => ({ ...prev, email: e.target.value }))}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Phone Number */}
          <div>
            <label className="block mb-1 font-semibold">Phone Number</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100">
              <FaPhone className="text-gray-500 mr-2" />
              <input
                type="text"
                value={customer.phoneNumber}
                onChange={(e) => setCustomer((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Latitude */}
          <div>
            <label className="block mb-1 font-semibold">Latitude</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={customer.latitude}
                onChange={(e) => setCustomer((prev) => ({ ...prev, latitude: e.target.value }))}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Longitude */}
          <div>
            <label className="block mb-1 font-semibold">Longitude</label>
            <div className="flex items-center border rounded-md p-2 bg-gray-100">
              <FaMapMarkerAlt className="text-gray-500 mr-2" />
              <input
                type="text"
                value={customer.longitude}
                onChange={(e) => setCustomer((prev) => ({ ...prev, longitude: e.target.value }))}
                required
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">
            Update Customer
          </button>
        </form>
      </div>
    </ProviderLayout>
  );
}
