import MapView from "../components/MapView.jsx";
import CategoryIcon from "../components/CategoryIcon.jsx";
import { formatDistance } from "../utils/distance.js";
import { CHECK_IN_RADIUS_M } from "../utils/derive.js";

export default function MapScreen({
  tasks,
  completed,
  selectedId,
  onSelect,
  onOpen,
  userPosition,
  nearby,
}) {
  return (
    <div className="screen map-screen">
      <MapView
        tasks={tasks}
        completed={completed}
        selectedId={selectedId}
        onSelect={onSelect}
        userPosition={userPosition}
      />

      {nearby && (
        <button
          type="button"
          className="nearby-toast"
          onClick={() => onOpen(nearby.task.id)}
        >
          <CategoryIcon category={nearby.task.category} size={36} />
          <div className="nearby-toast-body">
            <div className="nearby-toast-eyebrow">
              {nearby.distance <= CHECK_IN_RADIUS_M
                ? "✨ You're here — check in!"
                : "📡 Nearby challenge"}
            </div>
            <div className="nearby-toast-title">{nearby.task.title}</div>
            <div className="nearby-toast-meta">
              {formatDistance(nearby.distance)} away · {nearby.task.category}
            </div>
          </div>
          <span className="nearby-toast-cta" aria-hidden="true">→</span>
        </button>
      )}
    </div>
  );
}
