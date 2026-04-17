export function flattenCategoryData(categoryData) {
  if (!categoryData) return {};
  const output = {};
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
}
