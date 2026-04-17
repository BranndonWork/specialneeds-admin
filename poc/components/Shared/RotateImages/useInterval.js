import { useEffect } from "react";

export const useInterval = (callback, delay) => {
  useEffect(() => {
    const interval = setInterval(callback, delay);
    return () => clearInterval(interval);
  }, [callback, delay]);
};
