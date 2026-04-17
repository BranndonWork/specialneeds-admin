import { useEffect, useState } from "react";

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if user previously dismissed the prompt
    const dismissedUntil = localStorage.getItem("pwa-install-dismissed");
    if (dismissedUntil) {
      const dismissTime = parseInt(dismissedUntil);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissTime < sevenDays) {
        return; // Still within dismissal period
      }
    }

    // Listen for the beforeinstallprompt event
    const handleBeforeInstall = (e) => {
      e.preventDefault(); // Prevent the default browser prompt
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    // Check if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Show the browser's install prompt
    deferredPrompt.prompt();

    // Wait for the user's response
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    } else {
      console.log("User dismissed the install prompt");
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    // Remember dismissal for 7 days
    localStorage.setItem("pwa-install-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-prompt-banner">
      <div className="install-prompt-content">
        <span className="install-prompt-text">Install SpecialNeeds app for quick access!</span>
        <div className="install-prompt-buttons">
          <button onClick={handleInstall} className="install-prompt-button-install">
            Install
          </button>
          <button onClick={handleDismiss} className="install-prompt-button-dismiss">
            Dismiss
          </button>
        </div>
      </div>

      <style jsx>{`
        .install-prompt-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #007bff;
          color: white;
          z-index: 9999;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .install-prompt-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 20px;
          max-width: 1200px;
          margin: 0 auto;
          gap: 15px;
          flex-wrap: wrap;
        }

        .install-prompt-text {
          font-size: 14px;
          font-weight: 500;
        }

        .install-prompt-buttons {
          display: flex;
          gap: 10px;
        }

        .install-prompt-button-install,
        .install-prompt-button-dismiss {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .install-prompt-button-install {
          background: white;
          color: #007bff;
        }

        .install-prompt-button-install:hover {
          background: #f0f0f0;
        }

        .install-prompt-button-dismiss {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .install-prompt-button-dismiss:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        @media (max-width: 768px) {
          .install-prompt-content {
            flex-direction: column;
            text-align: center;
            padding: 15px;
          }

          .install-prompt-buttons {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
