import { useRouter } from "next/router";
import { User, Car, Calendar, Briefcase } from "lucide-react";

const SidebarSettings = () => {
  const router = useRouter();

  return (
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
  );
};

export default SidebarSettings;
