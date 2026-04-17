import config from "../config/config";

class CloudflareImages {
  buildParams(params) {
    if (!params || Object.keys(params).length === 0) return "public";

    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join(",");
  }

  getUrl(imageKey, overrideParams = {}) {
    const imageConfig = config.images[imageKey];

    if (!imageConfig || !imageConfig.id) {
      return null;
    }

    const deliveryUrl = config.cloudflare?.deliveryUrl;
    const accountHash = config.cloudflare?.accountHash;

    if (!deliveryUrl || !accountHash) {
      console.error("Cloudflare config missing deliveryUrl or accountHash");
      return null;
    }

    const params = { ...imageConfig.transformations, ...overrideParams };
    const transformations = this.buildParams(params);

    return `${deliveryUrl}/${accountHash}/${imageConfig.id}/${transformations}`;
  }

  isCloudflareImage(imageKey) {
    const imageConfig = config.images[imageKey];
    return imageConfig && typeof imageConfig === "object" && imageConfig.id;
  }
}

export default new CloudflareImages();
