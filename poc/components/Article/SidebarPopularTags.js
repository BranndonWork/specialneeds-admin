import CountBadge from "@components/Shared/CountBadge";

const SidebarPopularTags = ({ tags = [] }) => {
  if (!tags || tags.length === 0) return null;

  const tagUrl = (tag) => {
    const tagText = tag.tag || tag;
    const tag_encoded = encodeURIComponent(`#${tagText}`);
    return `/articles/?search=${tag_encoded}`;
  };

  return (
    <section className="widget" id="popular-tags-sidebar">
      <h3 className="widget-title">Popular Tags</h3>
      <nav aria-label="Popular article tags">
        <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0 0 0" }}>
          {tags.map((tag, i) => {
            const tagText = tag.tag || tag;
            const tagCount = tag.count || 0;
            return (
              <li key={i} style={{ marginBottom: "0.5rem" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <a
                    href={tagUrl(tag)}
                    style={{ textDecoration: "none", color: "#000" }}
                    aria-label={`View ${tagCount} articles tagged with ${tagText}`}
                  >
                    {tagText}
                  </a>
                  <CountBadge count={tagCount} ariaLabel={`${tagCount} articles`} />
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
};

export default SidebarPopularTags;
