export default function OfflinePage() {
  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    window.location.href = "/";
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>You&apos;re Offline</h1>
        <p style={styles.message}>It looks like you&apos;ve lost your internet connection.</p>
        <p style={styles.submessage}>Some cached content may still be available.</p>

        <div style={styles.buttons}>
          <button onClick={handleTryAgain} style={styles.buttonPrimary}>
            Try Again
          </button>
          <button onClick={handleGoHome} style={styles.buttonSecondary}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}

// Inline styles to ensure they work even if CSS isn't cached
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  content: {
    textAlign: "center",
    maxWidth: "500px",
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "2em",
    marginBottom: "0.5em",
    color: "#333",
  },
  message: {
    fontSize: "1.1em",
    marginBottom: "1em",
    color: "#666",
  },
  submessage: {
    fontSize: "0.9em",
    marginBottom: "2em",
    color: "#999",
  },
  buttons: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  buttonPrimary: {
    padding: "12px 24px",
    fontSize: "1em",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  buttonSecondary: {
    padding: "12px 24px",
    fontSize: "1em",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};
