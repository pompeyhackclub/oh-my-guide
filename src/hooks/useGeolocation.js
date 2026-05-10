import { useEffect, useState } from "react";

const supported =
  typeof navigator !== "undefined" && Boolean(navigator.geolocation);

const STORAGE_KEY = "ohmyguide.position.v1";

function loadCached() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.lat === "number" &&
      typeof parsed.lng === "number"
    ) {
      return parsed;
    }
  } catch {
    // ignore parse / storage errors
  }
  return null;
}

function persist(pos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos));
  } catch {
    // ignore quota / private mode
  }
}

export function useGeolocation() {
  const [position, setPosition] = useState(loadCached);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(supported ? "watching" : "unsupported");

  useEffect(() => {
    if (!supported) return;
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const next = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
        };
        setPosition(next);
        persist(next);
        setError(null);
        setStatus("watching");
      },
      (err) => {
        setError(err.message);
        setStatus(err.code === err.PERMISSION_DENIED ? "denied" : "error");
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  return { position, error, status };
}
