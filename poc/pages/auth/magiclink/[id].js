import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.specialneeds.com";

export default function MagicLink() {
  const router = useRouter();
  const { id, token } = router.query;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAccess = async () => {
    if (!id || !token) {
      setError("This link has expired or is no longer valid.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post(
        `${API_URL}/api/v1/conversations/auth/${id}/`,
        { token },
        { withCredentials: true }
      );
      router.replace(`/admin/messages/${id}`);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 401 || status === 403) {
        setError("This link has expired or is no longer valid.");
      } else {
        setError("Something went wrong. Please try again or contact support.");
      }
      setLoading(false);
    }
  };

  if (!router.isReady) {
    return null;
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f4f6f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "16px",
      fontFamily: "Verdana, Arial, Geneva, Tahoma, sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "8px",
        border: "1px solid #e5e7eb",
        padding: "40px",
        maxWidth: "420px",
        width: "100%",
      }}>
        <div style={{ marginBottom: "24px" }}>
          <div style={{ fontSize: "18px", fontWeight: 700, color: "#221638", marginBottom: "8px" }}>
            SpecialNeeds.com
          </div>
          <div style={{ fontSize: "14px", color: "#555" }}>
            You have been invited to access a conversation. Click the button below to continue.
          </div>
        </div>

        {error && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "6px",
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            color: "#b91c1c",
            fontSize: "13px",
            marginBottom: "20px",
          }}>
            {error}
          </div>
        )}

        {!token && !error && (
          <div style={{
            padding: "12px 16px",
            borderRadius: "6px",
            background: "#fef3c7",
            border: "1px solid #fde68a",
            color: "#92400e",
            fontSize: "13px",
            marginBottom: "20px",
          }}>
            This link appears to be incomplete. Please check your email for the original link.
          </div>
        )}

        <button
          onClick={handleAccess}
          disabled={loading || !token}
          style={{
            width: "100%",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            borderRadius: "6px",
            border: "none",
            background: loading || !token ? "#ccc" : "#0281c4",
            color: "#fff",
            cursor: loading || !token ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Verifying…" : "Access Conversation"}
        </button>
      </div>
    </div>
  );
}
