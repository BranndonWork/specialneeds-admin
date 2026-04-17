// SpecialNeeds.com - Service Worker Registration
// Simple PWA service worker registration

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then((registration) => {
      // Service worker registered successfully

      // Check for updates periodically (every hour)
      setInterval(
        () => {
          registration.update();
        },
        60 * 60 * 1000
      );

      // Handle updates
      registration.addEventListener("updatefound", () => {
        const newWorker = registration.installing;

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // New service worker is ready to take over
            console.log("[SW] New version available! Refresh to update.");

            // Optionally notify the user
            if (confirm("A new version of the app is available. Reload to update?")) {
              window.location.reload();
            }
          }
        });
      });

      // Send periodic cleanup message to service worker
      setInterval(
        () => {
          if (registration.active) {
            registration.active.postMessage({ type: "CLEANUP_CACHE" });
          }
        },
        10 * 60 * 1000
      ); // Every 10 minutes
    })
    .catch((error) => {
      console.error("[SW] Service Worker registration failed:", error);
    });

  // Listen for controller change (new SW activated)
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("[SW] Controller changed - reloading page");
    window.location.reload();
  });
} else {
  console.warn("[SW] Service workers are not supported by this browser");
}
