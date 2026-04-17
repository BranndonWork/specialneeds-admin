import ReactDOMServer from "react-dom/server";
import LocalStorage from "./LocalStorage";
import * as assetHelpers from "./assetHelpers";
import * as envHelpers from "./envHelpers";
import * as numberHelpers from "./numberHelpers";
import * as objectHelpers from "./objectHelpers";
import * as screenHelpers from "./screenHelpers";
import * as textHelpers from "./textHelpers";
import * as validateHelpers from "./validateHelpers";
import * as variableHelpers from "./variableHelpers";

class Utils {
  constructor() {
    this.rateLimits = {};
    this.throttled = {};
    this.localStorage = LocalStorage;
    Object.assign(this, validateHelpers);
    Object.assign(this, envHelpers);
    Object.assign(this, objectHelpers);
    Object.assign(this, textHelpers);
    Object.assign(this, numberHelpers);
    Object.assign(this, screenHelpers);
    Object.assign(this, variableHelpers);
    Object.assign(this, assetHelpers);

    // Token refresh reminder - dev only
    // current ts = 1702649112
    // Disabled: Token system updated
  }
  async sleep(ms) {
    // sleep for ms milliseconds
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Display
  displayPhoneNumber(content) {
    let phone = content?.phone;
    if (!phone) return phone;
    let displayPhone = "";
    if (phone && phone.length === 11 && phone.substring(0, 1) === "1") {
      phone = phone.substring(1, 11);
    }

    if (phone && phone.length === 10) {
      displayPhone = `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6, 10)}`;
    } else {
      displayPhone = phone;
    }

    return displayPhone;
  }

  makeFirstColumnWidthEqual(tableId) {
    let tables = document.querySelectorAll("table");
    if (tableId) {
      tables = document.querySelectorAll(`#${tableId}`);
    }
    let maxWidth = 0;

    tables.forEach((table) => {
      const cells = table.querySelectorAll("td:first-child");
      cells.forEach((cell) => {
        const width = cell.offsetWidth;
        if (width > maxWidth) {
          maxWidth = width;
        }
      });
    });

    tables.forEach((table) => {
      const cells = table.querySelectorAll("td:first-child");
      cells.forEach((cell) => {
        cell.style.width = `${maxWidth}px`;
      });
    });
  }

  displayWebLink(originalHref, anchorText = null) {
    if (!originalHref) return originalHref;
    if (!anchorText) anchorText = originalHref;

    let href = null;
    if (originalHref.indexOf(":") === -1) {
      href = `https://${originalHref}`;
    } else {
      href = originalHref;
    }
    // if the url starts with mailto: we should url encode the subject and body if they exist
    if (href.indexOf("mailto:") === 0) {
      const url = new URL(href);
      const subject = url.searchParams.get("subject");
      const body = url.searchParams.get("body");
      if (subject) {
        url.searchParams.set("subject", encodeURIComponent(subject));
      }
      if (body) {
        url.searchParams.set("body", encodeURIComponent(body));
      }
      href = url.toString();
    }
    return `<a href="${href}" target="_blank" class="share-button">${anchorText}</a>`;
  }

  sameSizeHeights(className) {
    const listings = document.querySelectorAll(className);
    let tallest = 0;

    listings.forEach((listing) => {
      listing.style.height = "auto";
      tallest = Math.max(tallest, listing.offsetHeight);
    });

    listings.forEach((listing) => {
      listing.style.height = tallest + "px";
    });
  }

  // Utils

  getPageData = (key = null) => {
    const pageDataKey = "pageData/" + window.location.pathname;
    const pageData = sessionStorage.getItem(pageDataKey)
      ? JSON.parse(sessionStorage.getItem(pageDataKey))
      : {};
    return key && pageData.hasOwnProperty(key) ? pageData[key] : pageData;
  };

  addPageData = (dataToAdd) => {
    // dataToAdd should be an object
    if (typeof dataToAdd !== "object") {
      return;
    }
    const pageDataKey = "pageData/" + window.location.pathname;
    let pageData = sessionStorage.getItem(pageDataKey)
      ? JSON.parse(sessionStorage.getItem(pageDataKey))
      : {};
    for (const key in dataToAdd) {
      if (dataToAdd.hasOwnProperty(key)) {
        // if the target is an object, we need to merge the objects
        if (typeof pageData[key] === "object" && typeof dataToAdd[key] === "object") {
          pageData[key] = { ...pageData[key], ...dataToAdd[key] };
        } else {
          pageData[key] = dataToAdd[key];
        }
      }
    }
    sessionStorage.setItem(pageDataKey, JSON.stringify({ ...pageData, ...dataToAdd }));
  };

  isMobileDevice = () => {
    return (
      this.isClientSide() &&
      (typeof window.orientation !== "undefined" ||
        navigator.userAgent.indexOf("IEMobile") !== -1 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
  };

  debounce(func, wait) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
      }, wait);
    };
  }

  throttle(func, limit, key) {
    key = key || func.name;
    return () => {
      const context = this;
      const args = arguments;
      if (!this.throttled[key]) {
        func.apply(context, args);
        this.throttled[key] = { lastRan: Date.now() };
      } else {
        clearTimeout(this.throttled[key].lastFunc);
        this.throttled[key].lastFunc = setTimeout(
          () => {
            if (Date.now() - this.throttled[key].lastRan >= limit) {
              func.apply(context, args);
              this.throttled[key].lastRan = Date.now();
            }
          },
          Math.max(limit - (Date.now() - this.throttled[key].lastRan), 0)
        );
      }
    };
  }

  rateLimit(func, limit, key) {
    if (!this.rateLimits[key]) {
      this.rateLimits[key] = {
        lastCalled: 0,
      };
    }
    const rateLimit = this.rateLimits[key];

    // Return a new function that applies the rate limit
    return (...args) => {
      const now = Date.now();
      if (now - rateLimit.lastCalled > limit) {
        rateLimit.lastCalled = now;
        func(...args); // Forward arguments to the original function
      }
    };
  }

  contentHash(content) {
    if (!content) return null;
    if (typeof content !== "string") {
      try {
        content = JSON.stringify(content);
      } catch (e) {
        try {
          content = ReactDOMServer.renderToString(content);
        } catch (error) {
          const randomString = Math.random().toString(36).substring(7);
          // console.error("Error generating content hash", { error, content: content, usingRandomString: randomString });
          content = randomString;
        }
      }
    }

    const hash = require("crypto")
      .createHash("md5")
      .update(content.replace(/\s/g, "").replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, ""))
      .digest("hex");
    return `hash-${hash}`;
  }

  md5(content) {
    return this.contentHash(content);
  }


  // USER DATA
  getPreference(key, defaultValue) {
    try {
      const preferences = this.localStorage.get("preferences", {});
      let localValue = preferences[key];
      return localValue || defaultValue;
    } catch (error) {
      return defaultValue;
    }
  }

  setPreference(key, value) {
    try {
      const preferences = this.localStorage.get("preferences", {});
      preferences[key] = value;
      return this.localStorage.set("preferences", preferences);
    } catch (error) {
      return;
    }
  }

  // GEOLOCATION
  displayAddress(
    content,
    inline = true,
    fields = ["street_1", "street_2", "city", "state_province", "postal_code", "country"]
  ) {
    if (!content) return "no content";
    let address = content?.address ? content.address : content;
    if (!address) return "no address";
    if (!address.state_province) return "no state";
    const separator = inline ? ", " : "<br/>";

    const addField = (field) => {
      if (fields.includes(field) && address[field]) {
        if (field === "street_1" && !isNaN(address[field])) {
          return "";
        }
        if (field === "country" && address[field].length == 2) {
          address[field] = address[field].toUpperCase();
        }
        return address[field];
      }
      return "";
    };

    const street = [addField("street_1"), addField("street_2")].filter(Boolean).join(separator);
    const cityStateZip = [addField("city"), addField("state_province"), addField("postal_code")]
      .filter(Boolean)
      .join(", ");

    const resultParts = [street, cityStateZip, addField("country")].filter(Boolean);

    return resultParts.join(separator);
  }

  async addressToCoordinates(address) {
    if (!address || !address?.state_province) return;

    const tryCoordinates = async (address) => {
      address = address.replace(/\s/g, "+");
      const url = `https://nominatim.openstreetmap.org/search.php?q=${address}&format=jsonv2`;
      const response = await fetch(url);
      const data = await response.json();
      return data.length ? [data[0].lat, data[0].lon] : null;
    };
    let addressString = this.displayAddress(address, true);
    let coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove street_2 and try again
    addressString = this.displayAddress(address, true, [
      "street_1",
      "city",
      "state_province",
      "postal_code",
      "country",
    ]);
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove country and try again
    addressString = this.displayAddress(address, true, [
      "street_1",
      "city",
      "state_province",
      "postal_code",
    ]);
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove house number from street_1 and try again
    addressString = addressString.replace(/^\d+\s+/, "");
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove street_1 and try again
    addressString = this.displayAddress(address, true, ["city", "state_province", "postal_code"]);
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove zipcode and try again
    addressString = this.displayAddress(address, true, ["city", "state_province"]);
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    // Remove city and try again
    addressString = this.displayAddress(address, true, ["state_province"]);
    coordinates = await tryCoordinates(addressString);
    if (coordinates) return coordinates;

    return null;
  }

  async coordinatesToAddress(lat, lon) {
    let url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2`;
    let response = await fetch(url);
    let data = await response.json();
    if (data.address) {
      return `${data.address.house_number} ${data.address.road}, ${data.address.city}, ${data.address.state_province}, ${data.address.postcode}, ${data.address.country}`;
    }
    return;
  }

  async locationServiceState() {
    const permission = await navigator.permissions.query({ name: "geolocation" });
    return permission.state;
  }

  async getUserLocation() {
    let userLocation = JSON.parse(localStorage.getItem("userLocation"));

    if (userLocation?.lat) return userLocation;

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          localStorage.setItem("userLocation", JSON.stringify(userLocation));
          resolve(userLocation);
        },
        (err) => {
          console.log(`Error(${err.code}): ${err.message}`);
          resolve(null);
        },
        {
          enableHighAccuracy: false,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    });
  }

  calculateDistance(lat1, lon1, lat2, lon2) {
    try {
      // Calculate the distance between two coordinates using the Haversine formula
      // https://en.wikipedia.org/wiki/Haversine_formula
      const earthRadius = 6371e3; // meters
      const lat1Radians = (lat1 * Math.PI) / 180; // latitude in radians
      const lat2Radians = (lat2 * Math.PI) / 180;
      const deltaLatRadians = ((lat2 - lat1) * Math.PI) / 180;
      const deltaLonRadians = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(deltaLatRadians / 2) ** 2 +
        Math.cos(lat1Radians) * Math.cos(lat2Radians) * Math.sin(deltaLonRadians / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = earthRadius * c; // in meters
      // convert to miles
      const miles = distance * 0.000621371;
      if (miles < 10 && miles.toString().split(".")[1].length > 1) {
        return miles.toFixed(1);
      }

      return miles;
    } catch (error) {
      console.error("Error calculating distance:", error);
      return null;
    }
  }

  // Clean & Sanitize

  cleanPhoneNumber(input) {
    const cleanedInput = input.replace(/[^0-9]/g, "");

    if (!cleanedInput || isNaN(cleanedInput)) return "";

    let formatted = "";
    if (cleanedInput.length < 10) {
      if (cleanedInput.length < 4) {
        formatted = cleanedInput;
      } else if (cleanedInput.length < 7) {
        formatted = `${cleanedInput.slice(0, 3)}-${cleanedInput.slice(3)}`;
      } else {
        formatted = `(${cleanedInput.slice(0, 3)}) ${cleanedInput.slice(3, 6)}-${cleanedInput.slice(6)}`;
      }
    } else if (cleanedInput.length === 11 && cleanedInput[0] !== "1") {
      formatted = cleanedInput;
    } else {
      formatted = `(${cleanedInput.slice(-10, -7)}) ${cleanedInput.slice(-7, -4)}-${cleanedInput.slice(-4)}`;
      if (cleanedInput.length === 11) formatted = `+${cleanedInput[0]} ${formatted}`;
    }
    return formatted;
  }

  cleanStreetAddress(address) {
    let cleanAddress = "";
    for (var i = 0; i < address.length; i++) {
      // get character
      var char = address[i];
      // check if last character is a valid character
      if (this.validateCharacterForStreetAddress(char)) {
        // add the character to the clean address
        cleanAddress += char;
      }
    }
    return cleanAddress;
  }

  cleanZipcode(zipCode) {
    const cleanZipcode = zipCode.replace(/[^\d-]/g, "");
    const digits = cleanZipcode.split("-").join("");
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits.slice(0, 5);
  }

  // Content Display Functions
  extendFaqs(faqs, faqsToAdd) {
    if (Array.isArray(faqs) && Array.isArray(faqsToAdd)) {
      for (let i = 0; i < faqsToAdd.length; i++) {
        let push = true;
        for (let j = 0; j < faqs.length; j++) {
          if (faqs[j].question == faqsToAdd[i].question) {
            push = false;
          }
        }
        if (push) {
          faqs.push(faqsToAdd[i]);
        }
      }
    }
    return faqs;
  }
}

export default new Utils();
