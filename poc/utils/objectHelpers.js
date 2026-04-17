// objectHelpers.js

/**
 * Parses a JSON string if possible, otherwise returns the original object.
 * @param {string|object} obj - The object to be parsed.
 * @returns {object|string} - Parsed object or the original input.
 */
export const maybeParseJson = (obj) => {
  try {
    return JSON.parse(obj);
  } catch (error) {
    return obj;
  }
};

/**
 * Deeply checks if two objects are equal.
 *
 * @param {Object} firstObject - The first object.
 * @param {Object} secondObject - The second object.
 * @returns {boolean} - Returns true if the objects are deeply equal, otherwise false.
 */
export const objectsAreEqual = (firstObject, secondObject) => {
  // Check if both objects are the same instance or both null
  if (firstObject === secondObject) {
    return true;
  }

  // Check if both objects are stringified versions of each other
  if (JSON.stringify(firstObject) === JSON.stringify(secondObject)) {
    return true;
  }

  // Check if either of the objects is null
  if (firstObject === null || secondObject === null) {
    return false;
  }

  const firstObjectKeys = Object.keys(firstObject);
  const secondObjectKeys = Object.keys(secondObject);

  // Check if both objects have the same number of properties
  if (firstObjectKeys.length !== secondObjectKeys.length) {
    return false;
  }

  // Check if each property has the same value in both objects
  return firstObjectKeys.every((property) => {
    if (!secondObjectKeys.includes(property)) {
      return false;
    }

    const firstValue = firstObject[property];
    const secondValue = secondObject[property];

    // Recursively check nested objects
    if (typeof firstValue === "object" && typeof secondValue === "object") {
      return objectsAreEqual(firstValue, secondValue);
    }

    return firstValue === secondValue;
  });
};

export const objectsHaveChanges = (originalObject, newObject) => {
  return !objectsAreEqual(originalObject, newObject);
};

export const isObject = (obj) => {
  return obj === Object(obj) && !Array.isArray(obj) && typeof obj !== "function" && obj !== null;
};

export const isEmptyObject = (obj) => {
  return isObject(obj) && Object.keys(obj).length === 0;
};

export const deepCloneObject = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

export const mergeObjects = (obj1, obj2) => {
  return { ...obj1, ...obj2 };
};

export const deleteKeyIfExist = (obj, key) => {
  if (obj.hasOwnProperty(key)) {
    delete obj[key];
  }
};
