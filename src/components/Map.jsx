import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import RecenterMap from "./RecenterMap";
import L from "leaflet";
import car from "../assets/Car-icon.png";
import { useVehicleTracker } from "../hooks/useVehicleTracker";

const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapComponent() {
  const { position, route, isPlaying, handlePlayPause } = useVehicleTracker();

  return (
    <>
      <MapContainer
        className="MapContainer"
        center={position}
        zoom={13}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={position} icon={carIcon} />
        <Polyline positions={route} color="blue" />
        <RecenterMap position={position} />
      </MapContainer>

      <div>
        <button className="btn" onClick={handlePlayPause}>
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </>
  );
}

export default MapComponent;
