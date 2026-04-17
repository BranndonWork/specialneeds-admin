export default function BlockedPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Access Denied</h1>
      <p style={{ color: "#666" }}>Your IP has been blocked due to suspicious activity.</p>
    </div>
  );
}
