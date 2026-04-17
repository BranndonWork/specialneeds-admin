import { CATEGORIES, SUBCATEGORIES, ACTIVE_SLUGS } from '@config/categoryConfig';

// Slider value at this position means "no radius filter — search nationwide"
export const NATIONWIDE = 1000;

export function getCategoryMeta(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || { icon: '📁', label: slug, color: '#94a3b8' };
}

/**
 * Returns the filtered + sorted subcategory list for a given parent slug.
 * Only includes the "all" entry and subcategories that have active listings.
 */
export function getActiveSubCategories(parentSlug) {
  return [...(SUBCATEGORIES[parentSlug] || [])]
    .filter((sub) => sub.slug === null || ACTIVE_SLUGS.has(`${parentSlug}/${sub.slug}`))
    .sort((a, b) => {
      if (a.slug === null) return -1;
      if (b.slug === null) return 1;
      return a.label.localeCompare(b.label);
    });
}
