class LocalStorage {
  get(key, defaultValue = null, raw = false) {
    if (typeof window === "undefined") return null;
    try {
      const item = JSON.parse(localStorage.getItem(key));
      if (!item) return defaultValue;
      const now = Math.round(new Date().getTime() / 1000);
      try {
        item.expires_in = item.expires - now;
      } catch (error) {}
      if (raw) return item;
      if (item.expires && item.expires < now) {
        localStorage.removeItem(key);
        return null;
      }
      return item.value;
    } catch (error) {
      return null;
    }
  }

  set(key, value, ttl = null) {
    if (typeof window === "undefined") return null;
    try {
      let now = Math.round(new Date().getTime() / 1000);
      let storeValue = JSON.stringify({
        value,
        ttl,
        expires: !isNaN(ttl) && ttl > 0 ? now + ttl : null,
        created: now,
      });
      localStorage.setItem(key, storeValue);
      return this.get(key) === value;
    } catch (error) {
      return null;
    }
  }

  remove(key) {
    if (typeof window === "undefined") return null;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      return null;
    }
  }
}

export default new LocalStorage();
