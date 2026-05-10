import { categoryMeta } from "../utils/category.js";

export default function CategoryIcon({ category, size = 36, className = "" }) {
  const { icon, accent } = categoryMeta(category);
  return (
    <span
      className={`category-icon ${className}`}
      style={{
        width: size,
        height: size,
        background: `${accent}22`,
        color: accent,
        fontSize: Math.round(size * 0.5),
      }}
      aria-hidden="true"
    >
      <i className={icon} />
    </span>
  );
}
