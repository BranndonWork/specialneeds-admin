import { geocode } from "nominatim-browser";

export const validateUUID = (uuid) => {
  if (!uuid || typeof uuid !== "string" || uuid.length !== 36) return false;
  if (!uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/))
    return false;
  if (uuid === "00000000-0000-0000-0000-000000000000") return false;
  return true;
};

export const tryGeocode = async (params, maxRetries = 3) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await geocode(params);
    } catch (error) {
      retries++;
      console.error(`Geocode error (attempt ${retries}):`, error);
      if (retries === maxRetries) {
        throw error;
      }
    }
  }
};

export const validateAddress = async (address, requiredFields = []) => {
  const { street_1, street_2, city, state_province, postal_code, country } = address;

  const countryCode = country === "CAN" ? "ca" : "us";

  const missingFields = requiredFields.filter((field) => !address[field]);
  if (missingFields.length > 0) {
    return { error: `Missing fields: ${missingFields.join(", ")}.` };
  }

  const geocodeOptions = (omitFields) => {
    let fullAddress = [
      omitFields.includes("street_1") ? null : street_1,
      omitFields.includes("street_2") ? null : street_2,
      omitFields.includes("city") ? null : city,
      omitFields.includes("state_province") ? null : state_province,
      omitFields.includes("postal_code") ? null : postal_code,
      countryCode,
    ]
      .filter(Boolean)
      .join(",");

    return {
      q: fullAddress,
      countrycodes: countryCode,
      limit: 1,
      addressdetails: 1,
    };
  };

  try {
    let results = await tryGeocode(geocodeOptions([]));
    if (!results.length) results = await tryGeocode(geocodeOptions(["city"]));
    if (!results.length) results = await tryGeocode(geocodeOptions(["postal_code"]));
    if (!results.length)
      results = await tryGeocode(geocodeOptions(["postal_code", "street_1", "street_2"]));

    if (!results.length) throw new Error("Address not found");
    return { address: results[0].address, latLong: [results[0].lat, results[0].lon] };
  } catch (error) {
    const errorType = requiredFields.length ? "error" : "warning";
    return { [errorType]: "Address not found. Retry." };
  }
};

export const isValidUrl = (str, forceHttps = false) => {
  if (!str || typeof str !== "string" || str.match(/^\d+$/)) return false;

  let urlStr;

  try {
    urlStr = new URL(str).toString();
  } catch (_) {
    urlStr = "https://" + str;
  }

  try {
    let urlObj = new URL(urlStr);

    if (urlObj.hostname.includes(".") && ["http:", "https:"].includes(urlObj.protocol)) {
      if (forceHttps && urlObj.protocol !== "https:") return false;
      return urlObj;
    }

    return false;
  } catch (_) {
    return false;
  }
};

// function that validates that a string is a URL for a specific domain
export const isValidUrlForDomain = (url, domain) => {
  const urlObj = isValidUrl(url);
  if (!urlObj) return false;
  if (!domain || domain == "*") return true;
  return domain ? urlObj.hostname.endsWith(`.${domain}`) || urlObj.hostname === domain : true;
};

// function that validates that a string is a phone number
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== "string") return false;
  // ensure it matches the correct format of a phone number of XXX-XXX-XXXX
  // allow an optional prefix of +1- or 1-
  if (!phone.match(/^(?:\+?1[-. ]?)?\(?([2-9][0-8][0-9])\)?[-. ]?([2-9][0-9]{2})[-. ]?([0-9]{4})$/))
    return false;
  return true;
};

// function that validates that a string is a zip code
export const validateZipCode = (zip) => {
  if (!zip || typeof zip !== "string") return false;
  // ensure it matches the correct format of a zip code of XXXXX or XXXXX-XXXX
  return zip.match(/^\d{5}(?:[-\s]\d{4})?$/);
};

// function that validates that a string is a state
export const validateState = (state) => {
  if (!state || typeof state !== "string") return false;
  // ensure it matches the correct format of a state of XX
  return state.match(/^[A-Z]{2}$/);
};

// function that validates that a string is an email
export const validateEmailAddress = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

export const validateCharacterForStreetAddress = (char) => {
  // return true if the character is a valid character for a street address
  return "`~,!@$%^*(){}|[]\\".indexOf(char) == -1;
};
