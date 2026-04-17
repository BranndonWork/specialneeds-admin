/**
 * Utility functions for transforming category_data between API and UI formats
 *
 * API Format (nested):
 * {
 *   "section-name": {
 *     "fields": {
 *       "field-name": {
 *         "label": "Field Label",
 *         "attributes": {
 *           "type": "text",
 *           "value": "actual value"
 *         }
 *       }
 *     }
 *   }
 * }
 *
 * UI/Submit Format (flat):
 * {
 *   "section-name": {
 *     "field-name": "actual value"
 *   }
 * }
 */

/**
 * Flatten category_data from API format to submit format
 * Used when sending data TO the API (create/update)
 */
export const flattenCategoryData = (categoryData: Record<string, any>): Record<string, any> => {
  if (!categoryData) return {};

  const output: Record<string, any> = {};

  for (const sectionKey in categoryData) {
    const section = categoryData[sectionKey];

    if (section && typeof section === 'object' && section.fields) {
      output[sectionKey] = {};

      for (const fieldKey in section.fields) {
        const field = section.fields[fieldKey];

        if (field && field.attributes && 'value' in field.attributes) {
          output[sectionKey][fieldKey] = field.attributes.value;
        }
      }
    }
  }

  return output;
};

/**
 * Unflatten category_data from API format to UI format
 * Used when receiving data FROM the API (getOne)
 *
 * Note: The API returns the nested format, so this function
 * is primarily for consistency and future-proofing
 */
export const unflattenCategoryData = (categoryData: Record<string, any>): Record<string, any> => {
  if (!categoryData) return {};

  // Check if already in nested format
  const firstSection = Object.values(categoryData)[0];
  if (firstSection && typeof firstSection === 'object' && firstSection.fields) {
    // Already in nested format, return as-is
    return categoryData;
  }

  // If in flat format, convert to nested
  const output: Record<string, any> = {};

  for (const sectionKey in categoryData) {
    const section = categoryData[sectionKey];

    if (section && typeof section === 'object') {
      output[sectionKey] = {
        fields: {}
      };

      for (const fieldKey in section) {
        const value = section[fieldKey];

        output[sectionKey].fields[fieldKey] = {
          attributes: {
            value: value
          }
        };
      }
    }
  }

  return output;
};
