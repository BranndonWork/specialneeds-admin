import { getActiveSubCategories } from './searchUtils';
import { headingStyle, subheadStyle, subCategoryCardStyle } from './styles';

/**
 * Step 2 — Sub-category picker.
 * Displays only subcategories that have active listings, plus the "all" option.
 */
const StepSubCategoryPicker = ({ categorySlug, catMeta, onSelect }) => {
  const subCats = getActiveSubCategories(categorySlug);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '2rem',
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${catMeta.color}18`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {catMeta.icon}
        </span>
        <h1 style={{ ...headingStyle, margin: 0, fontSize: '1.75rem' }}>
          {catMeta.label}
        </h1>
      </div>
      <p style={subheadStyle}>Which type of {catMeta.label.toLowerCase()} service?</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
        gap: '0.875rem',
        marginTop: '1.75rem',
      }}>
        {subCats.map((sub) => (
          <button
            key={sub.slug || 'all'}
            onClick={() => onSelect(sub.slug)}
            style={subCategoryCardStyle(catMeta.color, sub.slug === null)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = `${catMeta.color}12`;
              e.currentTarget.style.borderColor = catMeta.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = sub.slug === null ? `${catMeta.color}0a` : '#fff';
              e.currentTarget.style.borderColor = sub.slug === null ? catMeta.color : '#e2e8f0';
            }}
          >
            <span style={{ fontSize: '1.75rem', marginBottom: '0.5rem', display: 'block' }}>
              {sub.icon}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: sub.slug === null ? '700' : '500', color: '#1e293b', lineHeight: '1.3' }}>
              {sub.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StepSubCategoryPicker;
