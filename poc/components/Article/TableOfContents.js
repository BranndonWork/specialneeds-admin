import { useEffect, useState } from "react";

const slugify = (text, index) => {
  const base = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${base}-${index}`;
};

const TableOfContents = ({ contentRef, processedHtml }) => {
  const [headings, setHeadings] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const el = contentRef?.current;
    if (!el) return;

    const nodes = el.querySelectorAll("h2, h3");
    if (nodes.length < 3) return;

    const items = Array.from(nodes).map((node, i) => {
      node.id = slugify(node.textContent, i);
      return {
        id: node.id,
        text: node.textContent,
        level: node.tagName.toLowerCase(),
      };
    });

    setHeadings(items);
  }, [contentRef, processedHtml]);

  if (headings.length < 3) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const navbar = document.getElementById("main-navbar");
    const offset = (navbar ? navbar.offsetHeight : 0) + 20;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <div className="table-of-contents">
      <div className="toc-header" onClick={() => setIsOpen((o) => !o)}>
        <strong>Table of Contents</strong>
        <span className="toc-toggle">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <nav className="toc-nav" aria-label="Table of contents">
          <ul>
            {headings.map((h) => (
              <li key={h.id} className={h.level === "h3" ? "toc-h3" : ""}>
                <a href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)}>
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TableOfContents;
