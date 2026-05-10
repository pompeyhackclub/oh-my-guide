import { useMemo } from "react";
import ProgressRing from "./ProgressRing.jsx";
import CategoryIcon from "./CategoryIcon.jsx";
import { categoryGradient, categoryMeta } from "../utils/category.js";
import { distanceMeters, formatDistance } from "../utils/distance.js";
import { walkMinutes, xpFor } from "../utils/derive.js";

export default function TaskCard({
  task,
  done,
  allTasks,
  completed,
  userPosition,
  onOpen,
  variant = "feed", // "feed" (large) | "row" (compact)
}) {
  // Per-card progress ring shows category completion (e.g. 3/8 History done).
  const ringProgress = useMemo(() => {
    if (!allTasks) return done ? 1 : 0;
    const inCategory = allTasks.filter((t) => t.category === task.category);
    const doneInCategory = inCategory.filter((t) => completed?.[t.id]).length;
    return inCategory.length ? doneInCategory / inCategory.length : 0;
  }, [allTasks, completed, task.category, done]);

  const dist = userPosition ? distanceMeters(userPosition, task) : null;
  const walk = walkMinutes(dist);
  const { icon, accent } = categoryMeta(task.category);

  if (variant === "row") {
    return (
      <button
        type="button"
        className={`task-row ${done ? "task-row-done" : ""}`}
        onClick={() => onOpen(task.id)}
      >
        <CategoryIcon category={task.category} size={40} />
        <div className="task-row-body">
          <div className="task-row-title">
            <span className="task-id">#{task.id}</span> {task.title}
          </div>
          <div className="task-row-meta">
            <span className="chip chip-ghost">{task.category}</span>
            <DifficultyChip difficulty={task.difficulty} />
            {dist != null && <span className="chip chip-ghost">{formatDistance(dist)}</span>}
          </div>
        </div>
        <ProgressRing
          progress={done ? 1 : ringProgress}
          done={done}
          size={36}
          stroke={3}
        />
      </button>
    );
  }

  return (
    <article
      className={`task-card ${done ? "task-card-done" : ""}`}
      style={{ "--card-accent": accent }}
    >
      <button
        type="button"
        className="task-card-hero"
        style={{ background: categoryGradient(task.category) }}
        onClick={() => onOpen(task.id)}
        aria-label={`Open ${task.title}`}
      >
        <i className={`task-card-emoji ${icon}`} aria-hidden="true" />
        <span className="task-card-number">#{task.id}</span>
        <DifficultyChip difficulty={task.difficulty} className="task-card-difficulty" />
        {done && (
          <span className="task-card-done-tag" aria-hidden="true">
            ✓ Visited
          </span>
        )}
      </button>

      <div className="task-card-body">
        <div className="task-card-row">
          <CategoryIcon category={task.category} size={28} />
          <span className="task-card-category">{task.category}</span>
          <ProgressRing
            progress={done ? 1 : ringProgress}
            done={done}
            size={32}
            stroke={3}
            className="task-card-ring"
          />
        </div>

        <h3 className="task-card-title">{task.title}</h3>
        <p className="task-card-hint">{task.hint}</p>

        <div className="task-card-foot">
          <span className="reward-pill" title="Completion reward">
            <i className="fa-solid fa-star" style={{ color: "#fbbf24" }} aria-hidden="true" /> {xpFor(task)} XP
          </span>
          {dist != null && (
            <span className="task-card-distance">
              <i className="fa-solid fa-map-pin" style={{ color: "#dc2626" }} aria-hidden="true" /> {formatDistance(dist)}
              {walk != null && <span> · {walk} min walk</span>}
            </span>
          )}
        </div>

        <button
          type="button"
          className="task-card-cta"
          onClick={() => onOpen(task.id)}
        >
          {done ? "View memory" : "Start challenge"}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

function DifficultyChip({ difficulty, className = "" }) {
  return (
    <span
      className={`difficulty-chip difficulty-${difficulty.toLowerCase()} ${className}`}
    >
      {difficulty}
    </span>
  );
}
