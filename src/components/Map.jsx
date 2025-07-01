import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import RecenterMap from "./RecenterMap";
import { LOCAL_API_URL, INITIAL_POSITION } from "../config";
import L from "leaflet";
import car from "../assets/Car-icon.png";

const carIcon = new L.Icon({
  iconUrl: car,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

function MapComponent() {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [route, setRoute] = useState([INITIAL_POSITION]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [routeFinish, setRouteFinish] = useState(false);
  const intervalRef = useRef(null);
  const index = useRef(0);

  const handlePlayPause = () => {
    if (isPlaying) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      setIsPlaying(false);
    } else {
      if (routeFinish) {
        setRoute([INITIAL_POSITION]);
        setRouteFinish(false);
        setPosition(INITIAL_POSITION);
        index.current = 0;
      }
      intervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(LOCAL_API_URL + `?index=${index.current++}`);
          if (res.status === 204) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setIsPlaying(false);
            setRouteFinish(true);
            index.current = 0;
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
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>
    </>
  );
}

export default MapComponent;
