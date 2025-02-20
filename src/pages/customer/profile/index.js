import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { fetchWithAuth } from "../../utils/api";
import Navbar from "../../components/Navbar";
import { User, Car, Calendar, Briefcase, Settings, Edit } from "lucide-react";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { status, body } = await fetchWithAuth("/api/user/me");
        console.log(body)
        if (status === 200) {
          setUser(body.user);
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-600 animate-pulse">
          Loading...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
    console.log(user)

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto flex mt-24 px-6">
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

        {/* Profile Details Section */}
        <div className="w-3/4 bg-white p-8 rounded-lg shadow-lg ml-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-2xl font-semibold text-gray-900">Account</h2>
            <button
              onClick={() => router.push("/profile/edit")}
              className="p-2 rounded-full hover:bg-gray-200 transition"
            >
              <Edit className="w-5 h-5 text-green-600" />
            </button>
          </div>

          {/* Profile Information */}
          <div className="mt-6 flex items-center">
            {/* Profile Picture */}
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg">
              <img
                src={user?.avatar ? user.avatar : "/default-avatar.png"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-6 space-y-2 text-gray-700">
              
              <p>
                <strong>Name:</strong> {user?.name}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "Not Provided"}
              </p>
              <p>
                <strong>Phone:</strong> {user?.phoneNumber || "Not Provided"}
              </p>
              <p>
                <strong>Role:</strong> {user?.role}
              </p>
            </div>
          </div>

          {/* Close Account Button */}
          <div className="mt-8">
            <button className="text-red-600 hover:text-red-800 transition">
              Close my account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
