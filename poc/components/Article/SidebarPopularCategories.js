import { useState } from "react";
import CountBadge from "@components/Shared/CountBadge";

const buildCategoryUrl = (slug) => {
  if (!slug) return "/articles/";

  const parts = slug.split("/");
  if (parts.length === 2) {
    return `/articles/?category=${parts[0]}&sub_category=${parts[1]}`;
  }
  return `/articles/?category=${slug}`;
};

const SidebarPopularCategories = ({ categories = [] }) => {
  const [expanded, setExpanded] = useState(false);

  if (!categories || categories.length === 0) return null;

  const categoriesToDisplay = expanded ? categories : categories.slice(0, 5);

  return (
    <section className="widget" id="popular-categories-sidebar">
      <h3 className="widget-title">Categories</h3>
      <nav aria-label="Article categories">
        <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0 0" }}>
          {categoriesToDisplay.map((category, i) => (
            <li key={i} style={{ marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <a
                  href={buildCategoryUrl(category.slug)}
                  style={{ textDecoration: "none", color: "#000" }}
                  aria-label={`View ${category.count} articles in ${category.name}`}
                >
                  {category.name}
                </a>
                <CountBadge count={category.count} ariaLabel={`${category.count} articles`} />
              </div>
            </li>
          ))}
        </ul>
      </nav>
      {categories.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
          style={{
            background: "none",
            border: "none",
            color: "var(--mainColor, #0281c4)",
            cursor: "pointer",
            fontSize: "0.875rem",
            padding: "0.5rem 0",
            marginTop: "0.5rem"
          }}
        >
          {expanded ? "Show Less" : `Show All ${categories.length} Categories`}
        </button>
      )}
    </section>
  );
};

export default SidebarPopularCategories;
