import { useMap } from "react-leaflet";
import { useEffect } from "react";

function RecenterMap({ position }) {
  const map = useMap();

  useEffect(() => {
    map.setView(position);
  }, [position, map]);

  return null;
}
export default RecenterMap;
