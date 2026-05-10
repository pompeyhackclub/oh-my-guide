import { evaluateBadges } from "../data/badges.js";

export default function AchievementsScreen({ tasks, completed }) {
  const evaluated = evaluateBadges(tasks, completed);
  const earned = evaluated.filter((b) => b.earned);
  const locked = evaluated.filter((b) => !b.earned);

  return (
    <div className="screen achievements-screen">
      <header className="screen-header">
        <span className="eyebrow">Collectibles</span>
        <h2>Badges</h2>
        <p className="screen-sub">
          {earned.length} of {evaluated.length} earned. Keep exploring to unlock more.
        </p>
      </header>

      {earned.length > 0 && (
        <section className="badge-section">
          <h3>Unlocked</h3>
          <div className="badge-grid">
            {earned.map((b) => (
              <BadgeCard key={b.id} badge={b} earned />
            ))}
          </div>
        </section>
      )}

      <section className="badge-section">
        <h3>Locked</h3>
        <div className="badge-grid">
          {locked.length === 0 && (
            <div className="empty-card">
              👑 You've collected every badge. Pompey legend.
            </div>
          )}
          {locked.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BadgeCard({ badge, earned = false }) {
  return (
    <div className={`badge-card ${earned ? "badge-earned" : "badge-locked"}`}>
      <div className="badge-medal" aria-hidden="true">
        <span className="badge-emoji">{badge.icon}</span>
      </div>
      <h4>{badge.title}</h4>
      <p>{badge.description}</p>
      <span className="badge-state">
        {earned ? "✓ Earned" : "🔒 Locked"}
      </span>
    </div>
  );
}
