const TABS = [
  { id: "explore", label: "Explore", icon: "fa-solid fa-binoculars" },
  { id: "map", label: "Map", icon: "fa-solid fa-map" },
  { id: "checklist", label: "Checklist", icon: "fa-solid fa-list-check" },
  { id: "achievements", label: "Trophies", icon: "fa-solid fa-trophy" },
  { id: "profile", label: "Profile", icon: "fa-solid fa-arrow-trend-up" },
];

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="bottom-nav" aria-label="Primary navigation">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          className={`bottom-nav-item ${active === tab.id ? "bottom-nav-active" : ""}`}
          onClick={() => onChange(tab.id)}
          aria-current={active === tab.id ? "page" : undefined}
        >
          <i className={`bottom-nav-icon ${tab.icon}`} aria-hidden="true" />
          <span className="bottom-nav-label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
