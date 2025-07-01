import { useEffect, useRef, useState } from "react";
import { fetchLocation } from "../utils/api";
import { INITIAL_POSITION, FETCH_INTERVAL } from "../utils/constants";

export function useVehicleTracker() {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [route, setRoute] = useState([INITIAL_POSITION]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [routeFinished, setRouteFinished] = useState(false);

  const index = useRef(0);
  const intervalRef = useRef(null);

  const startTracking = () => {
    intervalRef.current = setInterval(async () => {
      try {
        const data = await fetchLocation(index.current);
        if (!data) {
          stopTracking();
          setRouteFinished(true);
          index.current = 0;
          return;
        }

        const newPos = [data[1], data[0]];
        setPosition(newPos);
        setRoute((prev) => [...prev, newPos]);
        index.current++;
      } catch (err) {
        console.error("Error fetching location:", err);
        stopTracking();
      }
    }, FETCH_INTERVAL);
    setIsPlaying(true);
  };

  const stopTracking = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      stopTracking();
    } else {
      if (routeFinished) {
        setPosition(INITIAL_POSITION);
        setRoute([INITIAL_POSITION]);
        setRouteFinished(false);
        index.current = 0;
      }
      startTracking();
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return {
    position,
    route,
    isPlaying,
    handlePlayPause,
  };
}
