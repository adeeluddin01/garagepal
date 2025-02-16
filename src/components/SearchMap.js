import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import L from "leaflet";

// Fix for missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  // iconRetinaUrl: "/marker-icon-2x.png",
  iconUrl: "/marker-icon.png",
  // shadowUrl: "/marker-shadow.png",
});

const Map = () => {
  const [position, setPosition] = useState([51.505, -0.09]); // Default: London (fallback)
  const [zoom, setZoom] = useState(13);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // Store search query
  const [radius, setRadius] = useState(5); // Store radius for search
  const [serviceProviders, setServiceProviders] = useState([]); // Store API response

  // Fetch current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition([pos.coords.latitude, pos.coords.longitude]);
          setZoom(14); // Zoom in when location is found
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location", error);
          setPosition([40.7128, -74.0060]); // Default fallback location (New York)
          setZoom(12);
          setLoading(false);
        }
      );
    } else {
      setPosition([40.7128, -74.0060]);
      setZoom(12);
      setLoading(false);
    }
  }, []);

  // Handle search query and radius change
  const handleSearch = () => {
    const apiUrl = `/api/search?query=${searchQuery}&radius=${radius}&latitude=${position[0]}&longitude=${position[1]}`;
    
    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        setServiceProviders(data); // Set service provider data from the API response
        console.log(serviceProviders)
      })
      .catch((error) => {
        console.error("Error fetching search results", error);
      });
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="relative w-full h-[700px]">
      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 bg-gray-800 text-white p-4 transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ width: "300px", height: "100%", zIndex: 9999 }}
      >
        {/* Collapse button */}
        <button
          onClick={toggleSidebar}
          className="absolute top-4 right-4 text-xl bg-transparent text-white"
        >
          {isSidebarOpen ? "Close" : "Open"} Sidebar
        </button>

        {/* Sidebar content */}
        <div className="mt-16">
          {/* Search Query Field */}
          <div className="mb-4">
            <label htmlFor="searchQuery" className="block text-sm font-semibold">Search Query</label>
            <input
              id="searchQuery"
              type="text"
              value={searchQuery}
              placeholder="Enter search term"
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Radius Field */}
          <div className="mb-4">
            <label htmlFor="radius" className="block text-sm font-semibold">Radius (km)</label>
            <input
              id="radius"
              type="number"
              value={radius}
              min="1"
              className="w-full mt-2 p-2 border rounded"
              onChange={(e) => setRadius(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full mt-4 p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      {/* Main Map */}
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-800">
          <p className="text-white text-lg">Loading your location...</p>
        </div>
      ) : (
        <MapContainer
          center={position}
          zoom={zoom}
          scrollWheelZoom={true}
          className="w-full h-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Current Location</Popup>
          </Marker>
          {serviceProviders.map((provider) => (
            <Marker
              key={provider.id}
              position={[provider.latitude, provider.longitude]}
            >
              <Popup>
                <strong>{provider.businessName}</strong>
                <p>{provider.location}</p>
                <p>{provider.ownerName}</p>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default Map;
