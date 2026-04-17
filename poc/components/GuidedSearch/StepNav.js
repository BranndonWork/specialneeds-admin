import { navBackBtnStyle } from './styles';

/**
 * Unified navigation row: back button (absolute left) + step progress dots (centered).
 * On step 4 with results, shows a "Start Over" pill next to the back button.
 */
const StepNav = ({ step, catMeta, onBack, onStartOver, hasResults }) => {
  const accentColor = catMeta ? catMeta.color : '#10c6c5';

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '1.5rem 1.5rem 0',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: step < 4 ? 'center' : 'flex-start',
      minHeight: '32px',
    }}>
      {/* Back + Start Over — grouped absolute-left */}
      {step > 1 && (
        <div style={{ position: 'absolute', left: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <button
            onClick={onBack}
            style={navBackBtnStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = catMeta ? `${catMeta.color}12` : '#f1f5f9';
              e.currentTarget.style.color = catMeta ? catMeta.color : '#0f172a';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#475569';
            }}
          >
            ← Back
          </button>

          {step >= 4 && hasResults && (
            <button
              onClick={onStartOver}
              style={{
                backgroundColor: accentColor,
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                padding: '0.4rem 1rem',
                marginLeft: '0.5rem',
              }}
            >
              Start Over
            </button>
          )}
        </div>
      )}

      {/* Step indicator dots — centered, only on steps 1–3 */}
      {step < 4 && (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: '32px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: s <= step ? accentColor : '#e2e8f0',
                transition: 'background-color 0.3s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StepNav;
