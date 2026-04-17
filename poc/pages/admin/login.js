import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { authProvider } from "../../providers/authProvider";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    authProvider.check().then(({ authenticated }) => {
      if (authenticated) router.replace("/admin/listings");
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await authProvider.login({ email, password });
    setLoading(false);
    if (result.success) {
      router.replace(result.redirectTo || "/admin/listings");
    } else {
      setError(result.error?.message || "Login failed");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    color: "#221638",
    boxSizing: "border-box",
    outline: "none",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "10px",
        border: "1px solid #e5e7eb",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
      }}>
        <div style={{ marginBottom: "28px" }}>
          <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 700, color: "#221638" }}>SpecialNeeds Dashboard</h1>
          <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#888" }}>Sign in to manage listings, articles, and more</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#555", marginBottom: "6px" }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && (
            <div style={{
              marginBottom: "16px",
              padding: "10px 12px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              fontSize: "13px",
              color: "#dc2626",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "10px",
              background: loading ? "#ccc" : "#0281c4",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
