import { GoogleMap, LoadScriptNext, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useState, useEffect } from "react";

const containerStyle = {
  width: "100%",
  height: "200px",
};

const defaultCenter = { lat: 40.7128, lng: -74.006 }; // Fallback location (NYC)

const GarageMap = ({ garages, userLocation }) => {
  const [directions, setDirections] = useState(null);
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (window.google) {
      console.log("Google Maps API Loaded Successfully");
    } else {
      console.error("Google Maps API Failed to Load");
    }
  }, []);

  const handleGetDirections = (garage) => {
    if (!userLocation) return;
    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: garage.latitude, lng: garage.longitude },
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK") {
          setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  };

  return (
    <LoadScriptNext googleMapsApiKey={API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={12}>
        {/* User's Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
        )}

        {/* Garage Markers */}
        {garages.length > 0 &&
          garages.map((garage) => (
            <Marker
              key={garage.id}
              position={{ lat: garage.latitude, lng: garage.longitude }}
              icon={{
                url: "/garage-icon.png", // Use custom icon if needed
                scaledSize: new window.google.maps.Size(40, 40),
              }}
              onClick={() => handleGetDirections(garage)}
            />
          ))}

        {/* Render Directions */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScriptNext>
  );
};

export default GarageMap;
