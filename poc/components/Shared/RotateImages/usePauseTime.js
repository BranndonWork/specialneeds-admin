import { useState } from "react";

export const usePauseTime = () => {
  const [pauseTime, setPauseTime] = useState(0);
  const [pauseStart, setPauseStart] = useState(null);

  const handleMouseEnter = () => {
    setPauseStart(Date.now());
    setPauseTime(0); // Reset pause time to avoid accumulation
  };

  const handleMouseLeave = () => {
    if (pauseStart) {
      const pauseDuration = Date.now() - pauseStart;
      setPauseTime(pauseDuration);
      setPauseStart(null); // Reset pause start
    }
  };

  return [pauseTime, handleMouseEnter, handleMouseLeave];
};
