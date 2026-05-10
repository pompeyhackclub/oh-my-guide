import { useMemo } from "react";
import ProgressRing from "../components/ProgressRing.jsx";
import CategoryIcon from "../components/CategoryIcon.jsx";
import { CATEGORIES } from "../data/tasks.js";
import {
  levelFor,
  totalXp,
  xpInLevel,
} from "../utils/derive.js";
import { evaluateBadges } from "../data/badges.js";

export default function ProfileScreen({
  tasks,
  completed,
  onReset,
  geoStatus,
}) {
  const xp = useMemo(() => totalXp(tasks, completed), [tasks, completed]);
  const level = levelFor(xp);
  const xpThisLevel = xpInLevel(xp);
  const earnedBadges = useMemo(
    () => evaluateBadges(tasks, completed).filter((b) => b.earned).length,
    [tasks, completed]
  );

  const doneCount = Object.keys(completed).filter((id) =>
    Number.isFinite(Number(id))
  ).length;
  const overallProgress = doneCount / tasks.length;

  const perCategory = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const all = tasks.filter((t) => t.category === cat);
      const done = all.filter((t) => completed[t.id]).length;
      return { category: cat, done, total: all.length };
    });
  }, [tasks, completed]);

  return (
    <div className="screen profile-screen">
      <header className="profile-hero">
        <div className="profile-avatar" aria-hidden="true">⚓</div>
        <div className="profile-hero-meta">
          <span className="eyebrow">Captain of</span>
          <h2>Pompey Adventures</h2>
          <span className="level-badge">Level {level}</span>
        </div>
        <ProgressRing
          progress={overallProgress}
          done={overallProgress >= 1}
          size={96}
          stroke={8}
          className="profile-ring"
        />
      </header>

      <div className="stat-grid">
        <Stat label="Tasks done" value={`${doneCount}/${tasks.length}`} />
        <Stat label="Total XP" value={xp.toLocaleString()} />
        <Stat label="Badges" value={earnedBadges} />
        <Stat label="Level" value={level} />
      </div>

      <section className="profile-card">
        <div className="section-row">
          <h3>Level {level}</h3>
          <span className="section-count">{xpThisLevel}/100 XP</span>
        </div>
        <div className="xp-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={xpThisLevel}>
          <span className="xp-bar-fill" style={{ width: `${xpThisLevel}%` }} />
        </div>
        <p className="profile-card-hint">
          Each completed task earns 10–50 XP based on difficulty. Hit 100 XP to level up.
        </p>
      </section>

      <section className="profile-card">
        <div className="section-row">
          <h3>By category</h3>
        </div>
        <ul className="category-progress">
          {perCategory.map(({ category, done, total }) => {
            const pct = total ? done / total : 0;
            return (
              <li key={category}>
                <CategoryIcon category={category} size={32} />
                <div className="category-progress-body">
                  <div className="category-progress-row">
                    <span>{category}</span>
                    <span className="category-progress-count">
                      {done}/{total}
                    </span>
                  </div>
                  <div className="category-bar">
                    <span
                      className="category-bar-fill"
                      style={{ width: `${Math.round(pct * 100)}%` }}
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="profile-card">
        <div className="section-row">
          <h3>Settings</h3>
        </div>
        <p className="profile-card-hint">
          Location: <strong>{statusLabel(geoStatus)}</strong>
        </p>
        <button
          type="button"
          className="danger-button"
          onClick={() => {
            if (doneCount === 0) return;
            if (confirm("Reset every check-in and lose your XP?")) onReset();
          }}
          disabled={doneCount === 0}
        >
          Reset progress
        </button>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function statusLabel(status) {
  switch (status) {
    case "watching":
      return "Tracking";
    case "denied":
      return "Permission denied";
    case "unsupported":
      return "Not supported";
    case "error":
      return "Error";
    default:
      return "Off";
  }
}
