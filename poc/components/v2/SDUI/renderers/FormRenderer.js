/**
 * FormRenderer - Renders form screens from SDUI
 */
export default function FormRenderer({ screen, content, styles }) {
  return (
    <div className="sdui-form">
      <h2>SDUI Form Renderer (v2)</h2>
      <p>Screen Type: {screen.type}</p>
      <p>Form fields will be dynamically rendered based on schema</p>
    </div>
  );
}
