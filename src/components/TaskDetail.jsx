import { useEffect } from "react";
import { categoryGradient, categoryMeta } from "../utils/category.js";
import { distanceMeters, formatDistance } from "../utils/distance.js";
import {
  CHECK_IN_RADIUS_M,
  walkMinutes,
  xpFor,
} from "../utils/derive.js";
import { tasks as allTasks, PORTSMOUTH_CENTER } from "../data/tasks.js";

export default function TaskDetail({
  task,
  done,
  userPosition,
  geoStatus,
  onClose,
  onCheckIn,
  onUncheck,
  onShowOnMap,
}) {
  // Lock body scroll while modal is open.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  // Close on Escape.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!task) return null;

  const meta = categoryMeta(task.category);
  // Display distance always falls back to Portsmouth Center so dist is never null.
  const referencePosition = userPosition ?? PORTSMOUTH_CENTER;
  const dist = distanceMeters(referencePosition, task);
  const walk = walkMinutes(dist);
  // Check-In verification uses the real GPS fix only.
  const realDist = userPosition ? distanceMeters(userPosition, task) : null;
  const withinRange = realDist != null && realDist <= CHECK_IN_RADIUS_M;

  const gpsLabel = (() => {
    if (geoStatus !== "watching")
      return "Enable location to verify check-in";
    if (realDist == null) return "Waiting for GPS… (estimated distance shown)";
    if (withinRange) return `You're within ${Math.round(realDist)} m — verified ✓`;
    return `${formatDistance(realDist)} away — get closer to check in`;
  })();

  return (
    <div
      className="detail-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onClick={onClose}
    >
      <div className="detail-sheet" onClick={(e) => e.stopPropagation()}>
        <header
          className="detail-hero"
          style={{ background: categoryGradient(task.category) }}
        >
          <button
            type="button"
            className="detail-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          <i className={`detail-hero-emoji ${meta.icon}`} aria-hidden="true" />
          <div className="detail-hero-meta">
            <span className="detail-hero-number">#{task.id} of {allTasks.length}</span>
            <span
              className={`difficulty-chip difficulty-${task.difficulty.toLowerCase()}`}
            >
              {task.difficulty}
            </span>
          </div>
        </header>

        <section className="detail-body">
          <div className="detail-title-row">
            <h2 id="detail-title">{task.title}</h2>
            <span className="reward-pill detail-reward">
              <span aria-hidden="true">⭐</span> {xpFor(task)} XP
            </span>
          </div>
          <p className="detail-category">
            <i className={meta.icon} aria-hidden="true" /> {task.category}
          </p>

          <p className="detail-story">{task.hint}</p>

          <dl className="detail-stats">
            <div>
              <dt>Distance</dt>
              <dd>{dist != null ? formatDistance(dist) : "—"}</dd>
            </div>
            <div>
              <dt>Walking time</dt>
              <dd>{walk != null ? `${walk} min` : "—"}</dd>
            </div>
            <div>
              <dt>Reward</dt>
              <dd>{xpFor(task)} XP</dd>
            </div>
          </dl>

          <div
            className={`gps-verify gps-${
              geoStatus !== "watching" ? "off" : withinRange ? "verified" : "far"
            }`}
          >
            <span className="gps-dot" aria-hidden="true" />
            <span>{gpsLabel}</span>
          </div>

          {done ? (
            <button type="button" className="check-in undo" onClick={onUncheck}>
              <span aria-hidden="true">↩</span> Mark as not visited
            </button>
          ) : (
            <button
              type="button"
              className={`check-in ${withinRange ? "ready" : "locked"}`}
              onClick={onCheckIn}
              disabled={!withinRange}
              title={
                withinRange
                  ? "Check in to claim XP"
                  : "Get within 100m to check in"
              }
            >
              {withinRange ? (
                <>✓ Check In · +{xpFor(task)} XP</>
              ) : (
                <>📍 Get closer to check in</>
              )}
            </button>
          )}

          <button
            type="button"
            className="detail-secondary"
            onClick={onShowOnMap}
          >
            Show on map →
          </button>
        </section>
      </div>
    </div>
  );
}
