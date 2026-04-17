export const getPageWidth = () => {
  return window.innerWidth;
};

let resizeObserver = null;

export const watchPageResize = (callback) => {
  const resizeHandler = () => {
    const width = getPageWidth();
    callback(width);
  };
  window.addEventListener("resize", resizeHandler);

  resizeObserver = new ResizeObserver(resizeHandler);
  resizeObserver.observe(document.body);
};

export const stopWatchingPageResize = () => {
  if (resizeObserver) {
    resizeObserver.disconnect();
    resizeObserver = null;
  }
  window.removeEventListener("resize", resizeHandler);
};
