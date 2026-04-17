export const toString = (value) => {
  if (value === undefined || value === null) return String(value);
  if (["string", "number", "boolean", "function", "symbol", "bigint"].includes(typeof value))
    return value.toString();
  if (value instanceof Date) return value.toISOString();

  // Covers object and array types
  return JSON.stringify(value);
};
