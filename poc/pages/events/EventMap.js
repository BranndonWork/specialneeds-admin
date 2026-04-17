import Utils from "@utils";
import { useEffect, useCallback } from "react";

const EventMap = function ({ event, addCustomHeadTag, displayAddressWithLink }) {
  const loadMap = useCallback(async () => {
    if (!event.address) return;
    let coordinates = await Utils.addressToCoordinates(event.address);
    if (!coordinates) return;
    var map = L.map("map", { scrollWheelZoom: false }).setView(coordinates, 10);

    var marker = L.marker(coordinates).addTo(map);

    marker.bindPopup(displayAddressWithLink(event)).openPopup();

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
  }, [event, displayAddressWithLink]);

  const loadEventMap = useCallback(() => {
    addCustomHeadTag({
      type: "link",
      attributes: {
        rel: "stylesheet",
        href: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css",
        integrity: "sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=",
        crossorigin: "",
      },
    });
    addCustomHeadTag({
      type: "script",
      attributes: {
        src: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js",
        integrity: "sha256-WBkoXOwTeyKclOHuWtc+i2uENFpDZ9YPdf5Hf+D7ewM=",
        crossorigin: "",
      },
    });

    // wait for the global variable L to become available
    var interval = setInterval(() => {
      if (typeof L !== "undefined") {
        clearInterval(interval);
        loadMap();
      }
    }, 100);
  }, [addCustomHeadTag, loadMap]);

  useEffect(() => {
    loadEventMap();
  }, [loadEventMap]);

  return (
    <div className="events-details-location">
      <div id="map" style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
}


export default EventMap;
