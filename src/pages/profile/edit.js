import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../utils/api";
import Navbar from "../../components/Navbar";
import FileUpload from "../../components/FileUpload";
import { User, Mail, Phone, Save, ArrowLeft, Car, Calendar, Briefcase } from "lucide-react";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    avatar: "",
  });

  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { status, body } = await fetchWithAuth("/api/user/me");

        if (status === 200) {
          setUser(body.user);
          setFormData({
            name: body.user.name || "",
            email: body.user.email || "",
            phoneNumber: body.user.phoneNumber || "",
            avatar: body.user.avatar || "/default-avatar.png",
          });
        } else {
          setError(body.message || "Failed to fetch user data.");
        }
      } catch (err) {
        setError("An error occurred while fetching user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (fileUrl) => {
    setFormData({ ...formData, avatar: fileUrl });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { status, body } = await fetchWithAuth(`/api/user/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (status === 200) {
      alert("✅ Profile updated successfully!");
      router.push("/profile");
    } else {
      alert(`❌ Update failed: ${body.message}`);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p className="text-lg font-semibold text-gray-600 animate-pulse">Loading...</p></div>;
  if (error) return <div className="flex justify-center items-center min-h-screen bg-gray-100"><p className="text-red-500 text-lg">{error}</p></div>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto flex mt-24 px-6">
        {/* Sidebar */}
        <div className="w-1/4 bg-white p-6 rounded-lg shadow-lg h-full">
          <h2 className="text-xl font-semibold mb-4">Settings</h2>
          <nav className="space-y-3 text-gray-700">
            <button
              onClick={() => router.push("/profile")}
              className="flex items-center px-4 py-2 w-full text-left rounded-lg hover:bg-gray-200 transition"
            >
              <User className="w-5 h-5 mr-3 text-blue-600" />
              Profile
            </button>
            <button
              onClick={() => router.push("/profile/vehicles")}
              className="flex items-center px-4 py-2 w-full text-left rounded-lg hover:bg-gray-200 transition"
            >
              <Car className="w-5 h-5 mr-3 text-green-600" />
              Vehicles
            </button>
            <button
              onClick={() => router.push("/profile/bookings")}
              className="flex items-center px-4 py-2 w-full text-left rounded-lg hover:bg-gray-200 transition"
            >
              <Calendar className="w-5 h-5 mr-3 text-purple-600" />
              Booking
            </button>
            <button
              onClick={() => router.push("/profile/service-providers")}
              className="flex items-center px-4 py-2 w-full text-left rounded-lg hover:bg-gray-200 transition"
            >
              <Briefcase className="w-5 h-5 mr-3 text-orange-600" />
              Service Provider
            </button>
          </nav>
        </div>

        {/* Edit Profile Section */}
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg ml-6">
          {/* Back Button */}
          <div className="flex justify-between items-center border-b pb-4">
            <button onClick={() => router.push("/profile")} className="flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Profile
            </button>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 mt-4">Edit Profile</h2>
          <p className="text-gray-500">Update your profile details</p>

          {/* Profile Picture */}
          <div className="mt-6 flex items-center space-x-6">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              <img
                src={formData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <FileUpload onUpload={handleAvatarUpload} />
          </div>

          {/* Edit Profile Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <User className="mr-2 text-gray-600" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name"
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Mail className="mr-2 text-gray-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center bg-gray-100 p-3 rounded-lg">
              <Phone className="mr-2 text-gray-600" />
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                className="w-full bg-transparent focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 text-white text-lg rounded-lg shadow-lg hover:bg-green-700 transition-transform transform hover:scale-105"
            >
              <Save className="w-5 h-5" />
              <span>Save Changes</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
