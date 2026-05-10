import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "ohmyguide.completed.v1";

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function useCompletedTasks() {
  const [completed, setCompleted] = useState(loadInitial);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // ignore quota / private mode
    }
  }, [completed]);

  const toggle = useCallback((id) => {
    setCompleted((prev) => {
      const next = { ...prev };
      if (next[id]) delete next[id];
      else next[id] = new Date().toISOString();
      return next;
    });
  }, []);

  const reset = useCallback(() => setCompleted({}), []);

  return { completed, toggle, reset };
}
