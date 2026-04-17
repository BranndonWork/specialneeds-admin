import { CATEGORIES, ACTIVE_PARENT_SLUGS } from '@config/categoryConfig';
import { headingStyle, subheadStyle, categoryCardStyle } from './styles';

/**
 * Step 1 — Category picker.
 * Displays only categories that have at least one active subcategory.
 */
const StepCategoryPicker = ({ onSelect }) => {
  const visibleCategories = [...CATEGORIES]
    .filter((cat) => ACTIVE_PARENT_SLUGS.has(cat.slug))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <div>
      <h1 style={headingStyle}>What are you looking for?</h1>
      <p style={subheadStyle}>Choose a category to get started.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '1rem',
        marginTop: '2rem',
      }}>
        {visibleCategories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => onSelect(cat.slug)}
            style={categoryCardStyle(cat.color)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${cat.color}40`;
              e.currentTarget.style.borderColor = cat.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <span style={{ fontSize: '2.25rem', lineHeight: 1, marginBottom: '0.75rem', display: 'block' }}>
              {cat.icon}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#1e293b', lineHeight: '1.3' }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepCategoryPicker;
