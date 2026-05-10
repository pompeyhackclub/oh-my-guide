// Reward XP per difficulty.
const XP_BY_DIFFICULTY = { Easy: 10, Medium: 25, Hard: 50 };

export function xpFor(task) {
  return XP_BY_DIFFICULTY[task.difficulty] ?? 10;
}

// Average walking pace ~80m/min.
export function walkMinutes(distanceMeters) {
  if (distanceMeters == null) return null;
  return Math.max(1, Math.round(distanceMeters / 80));
}

// Check-in radius — within this distance you can tap "Check In".
export const CHECK_IN_RADIUS_M = 100;

// Discovery radius — proximity hints surface at this distance.
export const DISCOVERY_RADIUS_M = 300;

export function totalXp(tasks, completed) {
  return tasks.reduce(
    (sum, t) => sum + (completed[t.id] ? xpFor(t) : 0),
    0
  );
}

export function levelFor(xp) {
  // 100 XP per level, level starts at 1.
  return Math.max(1, Math.floor(xp / 100) + 1);
}

export function xpInLevel(xp) {
  return xp % 100;
}
