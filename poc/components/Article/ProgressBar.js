import { useEffect, useState } from "react";

const ProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const articleEl = document.querySelector(".article-details-area");
      if (!articleEl) return;

      const articleTop = articleEl.getBoundingClientRect().top + window.scrollY;
      const articleHeight = articleEl.offsetHeight;
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;

      const raw = (scrollTop - articleTop) / (articleHeight - windowHeight) * 100;
      setProgress(Math.min(100, Math.max(0, raw)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="article-progress-bar"
      style={{ width: `${progress}%` }}
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
};

export default ProgressBar;
