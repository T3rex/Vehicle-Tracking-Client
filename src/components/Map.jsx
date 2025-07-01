import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import RecenterMap from "./RecenterMap";
import { API_URL } from "../config";
import L from "leaflet";
import car from "../assets/Car-icon.png";

const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapComponent() {
  const [position, setPosition] = useState([28.590290000000003, 77.33654]);
  const [route, setRoute] = useState([[28.590290000000003, 77.33654]]);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    } else {
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(API_URL);
          if (res.status === 204) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsPlaying(false);
            return;
          }
          const data = await res.json();
          const newPos = [data[1], data[0]];
          setPosition(newPos);
          setRoute((prev) => [...prev, newPos]);
        } catch (error) {
          console.error("Failed to fetch location:", error);
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setIsPlaying(false);
        }
      }, 1000);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <>
      <MapContainer
        className="MapContainer"
        center={position}
        zoom={13}
        scrollWheelZoom={true}
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
          {" "}
          {isPlaying ? "⏸ Pause" : "▶ Play"}{" "}
        </button>
      </div>
    </>
  );
}

export default MapComponent;
