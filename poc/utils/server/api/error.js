// Simple in-memory error tracking (resets on server restart)
const errorCache = new Map();

class ErrorManager {
  constructor() {
    this.maxErrorCount = 5;
  }

  async checkErrorThreshold(endpoint) {
    const errorKey = `error:${endpoint}`;
    const errorData = errorCache.get(errorKey);
    if (!errorData) return false;

    // Check if errors have expired (5 minutes)
    if (Date.now() - errorData.timestamp > 5 * 60 * 1000) {
      errorCache.delete(errorKey);
      return false;
    }

    return errorData.count >= this.maxErrorCount;
  }

  async updateErrorStatus(endpoint, isError) {
    const errorKey = `error:${endpoint}`;

    if (!isError) {
      errorCache.delete(errorKey);
      return;
    }

    const errorData = errorCache.get(errorKey) || { count: 0, timestamp: Date.now() };
    errorData.count = isError ? errorData.count + 1 : 0;
    errorData.timestamp = Date.now();
    errorCache.set(errorKey, errorData);
  }
}

export default new ErrorManager();
