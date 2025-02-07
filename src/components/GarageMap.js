import { GoogleMap, LoadScript, Marker, DirectionsRenderer } from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = { width: "100%", height: "400px" };

const GarageMap = ({ garages, userLocation }) => {
  const [directions, setDirections] = useState(null);
  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Function to calculate route to a selected garage
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
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap mapContainerStyle={containerStyle} center={userLocation || { lat: 40.7128, lng: -74.0060 }} zoom={14}>
        {/* User's Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" />
        )}

        {/* Garage Markers */}
        {garages.map((garage) => (
          <Marker
            key={garage.id}
            position={{ lat: garage.latitude, lng: garage.longitude }}
            onClick={() => handleGetDirections(garage)}
          />
        ))}

        {/* Render Directions */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GarageMap;
