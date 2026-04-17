import { useMemo } from 'react';
import ComponentRegistry from './ComponentRegistry';

/**
 * DynamicScreen - Renders screens from SDUI payload definitions
 *
 * @param {Object} screen - Screen definition from v2 API
 * @param {Object} content - Content data
 * @param {Object} styles - Style definitions
 * @param {Function} onError - Error callback
 */
export function DynamicScreen({ screen, content, styles, onError, ...props }) {
  const RendererComponent = useMemo(() => {
    try {
      const renderer = ComponentRegistry.getRenderer(screen.type);

      if (!renderer) {
        throw new Error(`No renderer registered for type: ${screen.type}`);
      }

      return renderer;
    } catch (error) {
      console.error('SDUI Renderer Error:', error);
      onError?.(error);
      return null;
    }
  }, [screen.type, onError]);

  if (!RendererComponent) {
    return (
      <div className="sdui-error">
        <p>Unable to render screen type: {screen.type}</p>
      </div>
    );
  }

  return (
    <RendererComponent
      screen={screen}
      content={content}
      styles={styles}
      {...props}
    />
  );
}

export default DynamicScreen;
