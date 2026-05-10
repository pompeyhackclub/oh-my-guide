import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { tasks } from "./data/tasks.js";
import BottomNav from "./components/BottomNav.jsx";
import TaskDetail from "./components/TaskDetail.jsx";
import ExploreScreen from "./screens/ExploreScreen.jsx";
import MapScreen from "./screens/MapScreen.jsx";
import ChecklistScreen from "./screens/ChecklistScreen.jsx";
import AchievementsScreen from "./screens/AchievementsScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";
import { useCompletedTasks } from "./hooks/useCompletedTasks.js";
import { useGeolocation } from "./hooks/useGeolocation.js";
import { useNearbyTask } from "./hooks/useNearbyTask.js";
import { evaluateBadges } from "./data/badges.js";
import { levelFor, totalXp, xpInLevel } from "./utils/derive.js";

function App() {
  const { completed, toggle, reset } = useCompletedTasks();
  const { position, status: geoStatus } = useGeolocation();
  const [tab, setTab] = useState("explore");
  const [selectedId, setSelectedId] = useState(null);
  const [detailId, setDetailId] = useState(null);

  const [badgeToast, setBadgeToast] = useState(null);

  // Wrap toggle so we can detect newly-earned badges at the event point
  // (rather than reacting in an effect, which triggers the cascading-render lint).
  const handleToggle = useCallback(
    (id) => {
      const before = new Set(
        evaluateBadges(tasks, completed)
          .filter((b) => b.earned)
          .map((b) => b.id)
      );
      const nextCompleted = completed[id]
        ? Object.fromEntries(
            Object.entries(completed).filter(([k]) => k !== String(id))
          )
        : { ...completed, [id]: new Date().toISOString() };
      const newlyEarned = evaluateBadges(tasks, nextCompleted).find(
        (b) => b.earned && !before.has(b.id)
      );
      toggle(id);
      if (newlyEarned) setBadgeToast(newlyEarned);
    },
    [completed, toggle]
  );

  // Auto-dismiss the badge toast after 4s. setBadgeToast lives inside the
  // setTimeout callback so it runs asynchronously, not in the effect body.
  useEffect(() => {
    if (!badgeToast) return;
    const t = setTimeout(() => setBadgeToast(null), 4000);
    return () => clearTimeout(t);
  }, [badgeToast]);

  const handleOpen = useCallback((id) => {
    setDetailId(id);
    setSelectedId(id);
  }, []);

  const handleSelectOnMap = useCallback((id) => {
    setSelectedId(id);
  }, []);

  const nearby = useNearbyTask(tasks, completed, position);

  const detailTask = useMemo(
    () => tasks.find((t) => t.id === detailId) ?? null,
    [detailId]
  );

  const xp = useMemo(() => totalXp(tasks, completed), [completed]);
  const level = levelFor(xp);
  const xpThisLevel = xpInLevel(xp);
  const doneCount = Object.keys(completed).filter((id) =>
    Number.isFinite(Number(id))
  ).length;

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">⚓</span>
          <div>
            <h1>Oh My Guide</h1>
            <p className="tagline">Things to do · Portsmouth</p>
          </div>
        </div>

        <div className="header-stats">
          <div className="header-stat">
            <span className="header-stat-value">Lv {level}</span>
            <div className="xp-bar header-xp">
              <span
                className="xp-bar-fill"
                style={{ width: `${xpThisLevel}%` }}
              />
            </div>
          </div>
          <div className="header-stat">
            <span className="header-stat-value">{doneCount}/{tasks.length}</span>
            <span className="header-stat-label">visited</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {tab === "explore" && (
          <ExploreScreen
            tasks={tasks}
            completed={completed}
            userPosition={position}
            geoStatus={geoStatus}
            onOpen={handleOpen}
          />
        )}
        {tab === "map" && (
          <MapScreen
            tasks={tasks}
            completed={completed}
            selectedId={selectedId}
            onSelect={handleSelectOnMap}
            onOpen={handleOpen}
            userPosition={position}
            nearby={nearby}
          />
        )}
        {tab === "checklist" && (
          <ChecklistScreen
            tasks={tasks}
            completed={completed}
            userPosition={position}
            onOpen={handleOpen}
          />
        )}
        {tab === "achievements" && (
          <AchievementsScreen tasks={tasks} completed={completed} />
        )}
        {tab === "profile" && (
          <ProfileScreen
            tasks={tasks}
            completed={completed}
            onReset={reset}
            geoStatus={geoStatus}
          />
        )}
      </main>

      {detailTask && (
        <TaskDetail
          task={detailTask}
          done={Boolean(completed[detailTask.id])}
          userPosition={position}
          geoStatus={geoStatus}
          onClose={() => setDetailId(null)}
          onCheckIn={() => {
            handleToggle(detailTask.id);
            setDetailId(null);
          }}
          onUncheck={() => {
            handleToggle(detailTask.id);
          }}
          onShowOnMap={() => {
            setSelectedId(detailTask.id);
            setTab("map");
            setDetailId(null);
          }}
        />
      )}

      {badgeToast && (
        <div className="badge-toast" role="status" aria-live="polite">
          <span className="badge-toast-medal" aria-hidden="true">
            {badgeToast.icon}
          </span>
          <div>
            <div className="badge-toast-title">Badge unlocked!</div>
            <div className="badge-toast-name">{badgeToast.title}</div>
          </div>
        </div>
      )}

      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
}

export default App;
