import ListRenderer from './renderers/ListRenderer';
import CardRenderer from './renderers/CardRenderer';
import FormRenderer from './renderers/FormRenderer';

/**
 * ComponentRegistry - Maps SDUI screen types to React components
 */
class ComponentRegistry {
  constructor() {
    this.renderers = new Map();
    this.registerDefaults();
  }

  registerDefaults() {
    // Register built-in renderers
    this.register('list', ListRenderer);
    this.register('card', CardRenderer);
    this.register('form', FormRenderer);
    this.register('article', ListRenderer); // Can reuse for articles
    this.register('directory', ListRenderer);
    this.register('listing-detail', CardRenderer);
  }

  /**
   * Register a new renderer
   * @param {string} type - Screen type identifier
   * @param {Component} component - React component to render this type
   */
  register(type, component) {
    this.renderers.set(type, component);
  }

  /**
   * Get renderer for a screen type
   * @param {string} type - Screen type identifier
   * @returns {Component|undefined} - React component or undefined
   */
  getRenderer(type) {
    return this.renderers.get(type);
  }

  /**
   * Check if renderer exists
   * @param {string} type - Screen type identifier
   * @returns {boolean}
   */
  hasRenderer(type) {
    return this.renderers.has(type);
  }
}

// Export singleton instance
const registry = new ComponentRegistry();
export default registry;
