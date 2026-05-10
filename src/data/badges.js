// Each badge has a predicate against (tasks, completed) and unlocks XP.
const completedTasks = (tasks, completed) =>
  tasks.filter((t) => completed[t.id]);

const countCategory = (tasks, completed, category) =>
  completedTasks(tasks, completed).filter((t) => t.category === category).length;

export const badges = [
  {
    id: "first-steps",
    title: "First Steps",
    description: "Tick off your first Pompey adventure.",
    icon: "👣",
    rule: (tasks, completed) => completedTasks(tasks, completed).length >= 1,
  },
  {
    id: "sea-legs",
    title: "Sea Legs",
    description: "Complete 5 challenges around the city.",
    icon: "⚓",
    rule: (tasks, completed) => completedTasks(tasks, completed).length >= 5,
  },
  {
    id: "pompey-wanderer",
    title: "Pompey Wanderer",
    description: "Tick off 25 tasks.",
    icon: "🧭",
    rule: (tasks, completed) => completedTasks(tasks, completed).length >= 25,
  },
  {
    id: "half-centurion",
    title: "Half Centurion",
    description: "Reach the halfway mark — 50 done.",
    icon: "🎖️",
    rule: (tasks, completed) => completedTasks(tasks, completed).length >= 50,
  },
  {
    id: "centurion",
    title: "Centurion",
    description: "Complete every single activity.",
    icon: "👑",
    rule: (tasks, completed) =>
      completedTasks(tasks, completed).length >= tasks.length,
  },
  {
    id: "naval-cadet",
    title: "Naval Cadet",
    description: "Visit 5 historic places.",
    icon: "🚢",
    rule: (tasks, completed) => countCategory(tasks, completed, "History") >= 5,
  },
  {
    id: "foodie",
    title: "Foodie",
    description: "Tuck into 5 food spots.",
    icon: "🍽️",
    rule: (tasks, completed) => countCategory(tasks, completed, "Food") >= 5,
  },
  {
    id: "rambler",
    title: "Rambler",
    description: "Complete 5 walking routes.",
    icon: "🥾",
    rule: (tasks, completed) => countCategory(tasks, completed, "Walks") >= 5,
  },
  {
    id: "view-hunter",
    title: "View Hunter",
    description: "Catch every viewpoint in the city.",
    icon: "🌅",
    rule: (tasks, completed) =>
      tasks
        .filter((t) => t.category === "Views")
        .every((t) => completed[t.id]),
  },
  {
    id: "globetrotter",
    title: "Pompey Polymath",
    description: "Tick off something in 6 different categories.",
    icon: "🧠",
    rule: (tasks, completed) => {
      const cats = new Set(
        completedTasks(tasks, completed).map((t) => t.category)
      );
      return cats.size >= 6;
    },
  },
];

export function evaluateBadges(tasks, completed) {
  return badges.map((b) => ({ ...b, earned: b.rule(tasks, completed) }));
}
