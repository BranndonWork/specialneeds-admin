/**
 * ListRenderer - Renders list-based screens from SDUI payload
 *
 * This is initially a stub that will be expanded as backend
 * SDUI payloads are defined
 */
export default function ListRenderer({ screen, content, styles }) {
  const { layout, header } = screen;
  const { items = [] } = content;

  return (
    <div className="sdui-list" data-layout={layout}>
      {header && (
        <header className="sdui-list-header">
          <h1>{header.title}</h1>
          {header.subtitle && <p>{header.subtitle}</p>}
        </header>
      )}

      <div className="sdui-list-items">
        {items.map((item, index) => (
          <div key={item.id || index} className="sdui-list-item">
            {/* TODO: Render based on item schema from SDUI payload */}
            <h3>{item.title || item.name}</h3>
            <p>{item.description || item.content}</p>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="sdui-empty-state">
          <p>No items found</p>
        </div>
      )}
    </div>
  );
}
