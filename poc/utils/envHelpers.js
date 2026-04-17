export const isServerSide = () => {
  return typeof window === "undefined";
};

export const isClientSide = () => {
  return !isServerSide();
};

export const getWebsiteHost = () => {
  return isServerSide() ? process.env.NEXT_PUBLIC_HOST : window.location.hostname;
};

export const isProd = () => {
  const host = getWebsiteHost();
  return host === "www.specialneeds.com" || host === "www2.specialneeds.com";
};
