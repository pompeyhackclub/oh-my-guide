import { useMemo } from "react";
import { distanceMeters } from "../utils/distance.js";
import { DISCOVERY_RADIUS_M } from "../utils/derive.js";

// Returns the closest unfinished task within DISCOVERY_RADIUS_M, or null.
// Pure derivation — recomputes on every position update so the toast
// distance stays in sync with the user's movement.
export function useNearbyTask(tasks, completed, userPosition) {
  return useMemo(() => {
    if (!userPosition) return null;
    let best = null;
    let bestDist = Infinity;
    for (const task of tasks) {
      if (completed[task.id]) continue;
      const d = distanceMeters(userPosition, task);
      if (d < bestDist) {
        bestDist = d;
        best = { task, distance: d };
      }
    }
    if (!best || best.distance > DISCOVERY_RADIUS_M) return null;
    return best;
  }, [tasks, completed, userPosition]);
}
