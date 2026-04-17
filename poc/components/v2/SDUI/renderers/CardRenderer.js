/**
 * CardRenderer - Renders card-based detail screens
 */
export default function CardRenderer({ screen, content, styles }) {
  return (
    <div className="sdui-card">
      <h2>SDUI Card Renderer (v2)</h2>
      <p>Screen Type: {screen.type}</p>
      <pre>{JSON.stringify(content, null, 2)}</pre>
    </div>
  );
}
