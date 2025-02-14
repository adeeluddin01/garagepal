import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaGg, FaUsers } from "react-icons/fa"; // Icons for sidebar

const ProviderLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section
  const router = useRouter();

  // Sidebar content
  const sidebarItems = [
    { name: "Dashboard", icon: <FaHome />, route: "/provider/dashboard" },
    { name: "Garages", icon: <FaGg />, route: "/provider/garages" },
    { name: "Employees", icon: <FaUsers />, route: "/provider/employees" },
    { name: "Bookings", icon: <FaUsers />, route: "/provider/bookings" },
    { name: "Customers", icon: <FaUsers />, route: "/provider/customers" },


  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="bg-indigo-600 text-white w-64 p-5">
        <h2 className="text-2xl font-bold mb-5">GaragePal Admin</h2>
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link href={item.route}>
                <div
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`flex items-center p-2 rounded-lg hover:bg-indigo-700 ${
                    activeSection === item.name.toLowerCase()
                      ? "bg-indigo-700"
                      : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-gray-100 p-5">
        {/* Navbar */}
        <header className="flex justify-between items-center p-4 bg-white shadow-md">
          <div className="text-2xl font-bold text-indigo-600">GaragePal</div>
          <div className="flex items-center space-x-4">
            <span>Welcome, Admin</span>
            <img
              src="/default-avatar.png"
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};

export default ProviderLayout;
