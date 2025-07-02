import { useEffect, useRef, useState } from "react";
import { fetchLocation, retryOrThrowError } from "../utils/api";
import { INITIAL_POSITION, FETCH_INTERVAL } from "../utils/constants";

export function useVehicleTracker() {
  const [position, setPosition] = useState(INITIAL_POSITION);
  const [route, setRoute] = useState([INITIAL_POSITION]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [routeFinished, setRouteFinished] = useState(false);

  const index = useRef(0);
  const timeoutRef = useRef(null);
  const isLocked = useRef(false);

  const fetchNextPosition = async () => {
    try {
      const data = await retryOrThrowError(
        fetchLocation,
        [index.current],
        1000,
        5
      );

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

      timeoutRef.current = setTimeout(fetchNextPosition, FETCH_INTERVAL);
    } catch (err) {
      clearTimeout(timeoutRef.current);
      console.error("Error fetching location:", err);
      stopTracking();
    }
  };

  const startTracking = async () => {
    await fetchNextPosition(); // Start loop
    setIsPlaying(true);
  };

  const stopTracking = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setIsPlaying(false);
  };

  const handlePlayPause = async () => {
    if (isLocked.current) return;
    isLocked.current = true;

    if (isPlaying) {
      stopTracking();
    } else {
      if (routeFinished) {
        setPosition(INITIAL_POSITION);
        setRoute([INITIAL_POSITION]);
        setRouteFinished(false);
        index.current = 0;
      }
      await startTracking();
    }

    setTimeout(() => {
      isLocked.current = false;
    }, 300);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return {
    position,
    route,
    isPlaying,
    handlePlayPause,
  };
}
