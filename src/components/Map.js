import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = {
  lat: 25.276987, // Default to Dubai if no location is given
  lng: 55.296249,
};

export default function Map({ latitude, longitude }) {
  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={latitude && longitude ? { lat: latitude, lng: longitude } : defaultCenter}
      >
        {latitude && longitude && <Marker position={{ lat: latitude, lng: longitude }} />}
      </GoogleMap>
    </LoadScript>
  );
}
