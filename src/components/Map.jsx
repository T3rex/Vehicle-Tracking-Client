import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import RecenterMap from "./RecenterMap";
import { API_URL } from "../config";
import L from "leaflet";
import car from "../assets/Car-icon.png";

const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [40, 40],
  iconAnchor: [20, 40], // optional: center-bottom
});

function MapComponent() {
  const [position, setPosition] = useState([41.87662, -87.64765]);
  const [route, setRoute] = useState([[41.87662, -87.64765]]);
  const intervalRef = useRef(null);

  const handlePlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    } else {
      setRoute([]);
    }

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch(API_URL);
        if (res.status === 204) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          return;
        }
        const data = await res.json();
        const newPos = [data[0], data[1]];
        setPosition(newPos);
        setRoute((prev) => [...prev, newPos]);
      } catch (error) {
        console.error("Failed to fetch location:", error);
      }
    }, 1000);
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
        <button onClick={handlePlay}>▶ Play</button>
      </div>
    </>
  );
}

export default MapComponent;
