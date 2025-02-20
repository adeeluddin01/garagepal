import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaHome, FaGg, FaUsers, FaClipboardList, FaMoon, FaSun, FaBars } from "react-icons/fa"; // Icons
import { MdLogout } from "react-icons/md"; // Logout icon

const ProviderLayout = ({ children }) => {
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section
  const [darkMode, setDarkMode] = useState(false); // Track dark mode
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle sidebar
  const router = useRouter();

  // Sidebar content
  const sidebarItems = [
    { name: "Dashboard", icon: <FaHome />, route: "/provider/dashboard" },
    { name: "Garages", icon: <FaGg />, route: "/provider/garages" },
    { name: "Employees", icon: <FaUsers />, route: "/provider/employees" },
    { name: "Bookings", icon: <FaClipboardList />, route: "/provider/bookings" },
    { name: "Customers", icon: <FaUsers />, route: "/provider/customer-onboarding" },
  ];

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`flex min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      {/* Sidebar */}
      <div className={`bg-indigo-600 text-white w-64 p-5 transition-all duration-300 ${isSidebarOpen ? "block" : "hidden"} sm:block`}>
        {/* Logo & Toggle */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">GaragePal Admin</h2>
          <button className="text-white sm:hidden" onClick={toggleSidebar}>
            ✖
          </button>
        </div>

        {/* Sidebar Menu */}
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.name} className="mb-4">
              <Link href={item.route}>
                <div
                  onClick={() => setActiveSection(item.name.toLowerCase())}
                  className={`flex items-center p-3 rounded-lg hover:bg-indigo-700 transition-all duration-200 ${
                    activeSection === item.name.toLowerCase() ? "bg-indigo-700" : ""
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>

        {/* Dark Mode Toggle & Logout */}
        <div className="mt-6">
          <button className="flex items-center justify-center w-full p-2 bg-indigo-700 rounded-lg hover:bg-indigo-800" onClick={toggleDarkMode}>
            {darkMode ? <FaSun className="mr-2" /> : <FaMoon className="mr-2" />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
          <button className="flex items-center justify-center w-full p-2 bg-red-600 rounded-lg hover:bg-red-700 mt-3">
            <MdLogout className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-5">
        {/* Navbar */}
        <header className={`flex justify-between items-center p-4 shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}>
          <button className="text-2xl sm:hidden" onClick={toggleSidebar}>
            <FaBars />
          </button>
          <div className="text-2xl font-bold">GaragePal</div>
          <div className="flex items-center space-x-4">
            <span>Welcome, Admin</span>
            <img
              src="/default-avatar.png"
              alt="User Avatar"
              className="w-10 h-10 rounded-full border-2 border-gray-300"
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
