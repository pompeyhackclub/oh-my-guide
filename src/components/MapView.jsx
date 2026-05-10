import { useEffect, useRef, useState } from "react";
import { PORTSMOUTH_CENTER } from "../data/tasks.js";

function waitForLeaflet() {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.L) {
      resolve(window.L);
      return;
    }
    const id = setInterval(() => {
      if (window.L) {
        clearInterval(id);
        resolve(window.L);
      }
    }, 60);
  });
}

export default function MapView({
  tasks,
  completed,
  selectedId,
  onSelect,
  userPosition,
  fillContainer = true,
}) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef(new Map());
  const userMarkerRef = useRef(null);
  const userAccuracyRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    waitForLeaflet().then((L) => {
      if (cancelled || mapRef.current || !mapEl.current) return;
      const map = L.map(mapEl.current, {
        center: [PORTSMOUTH_CENTER.lat, PORTSMOUTH_CENTER.lng],
        zoom: 13,
        zoomControl: true,
      });
      // CARTO Voyager — bright, friendly, OSM-compatible tiles.
      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 19,
        }
      ).addTo(map);
      mapRef.current = map;
      setReady(true);
    });
    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Re-measure on container size changes.
  useEffect(() => {
    if (!ready || !mapRef.current || !mapEl.current) return;
    const map = mapRef.current;
    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(mapEl.current);
    return () => ro.disconnect();
  }, [ready]);

  // Sync markers with task + completion state.
  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const L = window.L;
    const map = mapRef.current;
    const seen = new Set();

    tasks.forEach((task) => {
      seen.add(task.id);
      const done = Boolean(completed[task.id]);
      const isSelected = selectedId === task.id;
      const className =
        "task-pin" +
        (done ? " task-pin-done" : "") +
        (isSelected ? " task-pin-selected" : "");
      const icon = L.divIcon({
        className: "task-pin-wrap",
        html: `<span class="${className}">${done ? "&#10003;" : task.id}</span>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      let marker = markersRef.current.get(task.id);
      if (!marker) {
        marker = L.marker([task.lat, task.lng], { icon }).addTo(map);
        marker.bindPopup(
          `<strong>${task.title}</strong><br/><em>${task.category}</em><br/>${task.hint}`
        );
        marker.on("click", () => onSelect(task.id));
        markersRef.current.set(task.id, marker);
      } else {
        marker.setIcon(icon);
      }
    });

    markersRef.current.forEach((marker, id) => {
      if (!seen.has(id)) {
        marker.remove();
        markersRef.current.delete(id);
      }
    });
  }, [tasks, completed, selectedId, onSelect, ready]);

  // Fly to selected task.
  useEffect(() => {
    if (!ready || !mapRef.current || selectedId == null) return;
    const marker = markersRef.current.get(selectedId);
    if (!marker) return;
    const latlng = marker.getLatLng();
    mapRef.current.flyTo(latlng, Math.max(mapRef.current.getZoom(), 15), {
      duration: 0.6,
    });
    marker.openPopup();
  }, [selectedId, ready]);

  // User-location marker.
  useEffect(() => {
    if (!ready || !mapRef.current || !userPosition) return;
    const L = window.L;
    const map = mapRef.current;
    const latlng = [userPosition.lat, userPosition.lng];

    if (!userMarkerRef.current) {
      const icon = L.divIcon({
        className: "user-pin-wrap",
        html: '<span class="user-pin"></span>',
        iconSize: [22, 22],
        iconAnchor: [11, 11],
      });
      userMarkerRef.current = L.marker(latlng, {
        icon,
        zIndexOffset: 1000,
      }).addTo(map);
      userMarkerRef.current.bindPopup("You are here");
    } else {
      userMarkerRef.current.setLatLng(latlng);
    }

    if (userPosition.accuracy) {
      if (!userAccuracyRef.current) {
        userAccuracyRef.current = L.circle(latlng, {
          radius: userPosition.accuracy,
          color: "#A34B14",
          weight: 1,
          fillColor: "#A34B14",
          fillOpacity: 0.15,
        }).addTo(map);
      } else {
        userAccuracyRef.current.setLatLng(latlng);
        userAccuracyRef.current.setRadius(userPosition.accuracy);
      }
    }
  }, [userPosition, ready]);

  const recentre = () => {
    if (!mapRef.current) return;
    if (userPosition) {
      mapRef.current.flyTo([userPosition.lat, userPosition.lng], 15, {
        duration: 0.6,
      });
    } else {
      mapRef.current.flyTo(
        [PORTSMOUTH_CENTER.lat, PORTSMOUTH_CENTER.lng],
        13,
        { duration: 0.6 }
      );
    }
  };

  return (
    <div className={`map-wrapper ${fillContainer ? "map-fill" : ""}`}>
      <div ref={mapEl} className="map" aria-label="Portsmouth map" />
      <button
        type="button"
        className="map-recentre"
        onClick={recentre}
        aria-label="Recentre map"
      >
        {userPosition ? "📍 Centre on me" : "📍 Centre on Portsmouth"}
      </button>
    </div>
  );
}
