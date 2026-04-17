export const useAssets = ({}) => {
  const isClient = typeof window !== "undefined";

  if (isClient) {
    // Client-side only logic here
  } else {
    // Server-side only logic here
  }
};
