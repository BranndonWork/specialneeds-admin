import { useEffect, useRef } from 'react';

/**
 * Hook to prefetch content as it becomes visible on scroll
 * Sends messages to service worker to prefetch URLs and images
 */
export function usePrefetchOnScroll() {
  const prefetchedUrls = useRef(new Set());
  const prefetchedImages = useRef(new Set());
  const observerRef = useRef(null);
  const mutationObserverRef = useRef(null);
  const observedElements = useRef(new Set());
  const debounceTimerRef = useRef(null);

  useEffect(() => {
    // Check if service worker is supported and registered
    if (!('serviceWorker' in navigator) || !navigator.serviceWorker.controller) {
      return;
    }

    // Helper to extract image URL from element
    const extractImageUrl = (element) => {
      // Check for background-image style
      const bgDiv = element.querySelector('[id^="background-"]');
      if (bgDiv) {
        const bgImage = bgDiv.style.backgroundImage;
        if (bgImage) {
          const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
          if (match && match[1]) {
            return match[1];
          }
        }
      }

      // Check for img element
      const img = element.querySelector('img');
      if (img && img.src) {
        // Prefer the larger image from srcset if available
        if (img.srcset) {
          const srcsetParts = img.srcset.split(',');
          const largestSrc = srcsetParts[srcsetParts.length - 1].trim().split(' ')[0];
          return largestSrc;
        }
        return img.src;
      }

      return null;
    };

    // Helper to prefetch URL
    const prefetchUrl = (url) => {
      if (url && !prefetchedUrls.current.has(url)) {
        prefetchedUrls.current.add(url);
        navigator.serviceWorker.controller.postMessage({
          type: 'PREFETCH_URL',
          url: url,
        });
      }
    };

    // Helper to prefetch image
    const prefetchImage = (imageUrl) => {
      // Skip data URIs (base64 images, Next.js placeholders, etc.)
      if (!imageUrl || imageUrl.startsWith('data:') || imageUrl.startsWith('blob:')) {
        return;
      }
      if (!prefetchedImages.current.has(imageUrl)) {
        prefetchedImages.current.add(imageUrl);
        navigator.serviceWorker.controller.postMessage({
          type: 'PREFETCH_IMAGE',
          url: imageUrl,
        });
      }
    };

    // Create intersection observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;

            // All internal links - simple and catches everything
            if (element.tagName === 'A' && element.href) {
              const url = new URL(element.href, window.location.origin);
              // Only prefetch same-origin URLs
              if (url.origin === window.location.origin) {
                prefetchUrl(element.href);

                // Try to extract and prefetch any images in/near this link
                const imageUrl = extractImageUrl(element);
                if (imageUrl) {
                  prefetchImage(imageUrl);
                }
              }
            }
          }
        });
      },
      {
        // Start prefetching when item is within 500px of viewport
        rootMargin: '500px',
        threshold: 0.01,
      }
    );

    observerRef.current = observer;

    // Helper to observe a single element (prevents duplicates)
    const observeElement = (element) => {
      if (observedElements.current.has(element)) return;
      observedElements.current.add(element);
      observer.observe(element);
    };

    // Helper to observe all internal links on the page
    const observeAllElements = () => {
      // Just get all internal links - simpler and catches everything
      const internalLinks = document.querySelectorAll('a[href^="/"]');
      internalLinks.forEach(observeElement);
    };

    // Debounced mutation handler
    const handleMutations = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      debounceTimerRef.current = setTimeout(() => {
        observeAllElements();
      }, 100);
    };

    // Create MutationObserver to detect dynamically added content
    const mutationObserver = new MutationObserver(handleMutations);
    mutationObserverRef.current = mutationObserver;

    // Target containers to watch (prioritize specific containers, fallback to body)
    const containersToWatch = [
      document.querySelector('#algolia-search'),
      document.querySelector('.destinations-area'),
      document.querySelector('#__next'),
    ].filter(Boolean);

    const targetContainers = containersToWatch.length > 0
      ? containersToWatch
      : [document.body];

    targetContainers.forEach((container) => {
      mutationObserver.observe(container, {
        childList: true,
        subtree: true,
      });
    });

    // Initial observation of elements already on the page
    // Delay to ensure DOM is fully rendered, hydrated, and painted
    const initialObservationTimer = setTimeout(() => {
      // Use requestAnimationFrame to ensure browser has painted
      requestAnimationFrame(() => {
        observeAllElements();
      });
    }, 1000);

    return () => {
      clearTimeout(initialObservationTimer);
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (mutationObserverRef.current) {
        mutationObserverRef.current.disconnect();
      }
      observedElements.current.clear();
    };
  }, []); // Empty deps - set up once, MutationObserver handles dynamic content

  return null;
}
