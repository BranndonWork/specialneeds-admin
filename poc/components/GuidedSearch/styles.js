// Shared style objects and style functions for the GuidedSearch components.

export const headingStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  color: '#0f172a',
  margin: '0 0 0.5rem',
  letterSpacing: '-0.02em',
};

export const subheadStyle = {
  fontSize: '1rem',
  color: '#64748b',
  margin: 0,
};

export const locationInputStyle = {
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: '1rem',
  marginBottom: '1rem',
  outline: 'none',
  boxSizing: 'border-box',
};

export const primaryBtnStyle = {
  padding: '0.875rem 2rem',
  backgroundColor: '#10c6c5',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '1rem',
  fontWeight: '600',
};

export const secondaryBtnStyle = {
  width: '100%',
  padding: '0.75rem',
  backgroundColor: '#fff',
  color: '#475569',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9375rem',
  fontWeight: '500',
};

export const geoLockedStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: '0.875rem 1rem',
  border: '2px solid #10b981',
  borderRadius: '8px',
  backgroundColor: '#f0fdf4',
  fontSize: '1rem',
  marginBottom: '1rem',
  boxSizing: 'border-box',
};

export const clearGeoBtnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '1rem',
  color: '#64748b',
  padding: '0 0.25rem',
  lineHeight: 1,
  flexShrink: 0,
};

export const categoryCardStyle = (color) => ({
  padding: '1.5rem 1rem',
  backgroundColor: '#fff',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'all 0.2s',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  minHeight: '120px',
});

export const subCategoryCardStyle = (color, isAll) => ({
  padding: '1.25rem 1rem',
  backgroundColor: isAll ? `${color}0a` : '#fff',
  border: `2px solid ${isAll ? color : '#e2e8f0'}`,
  borderRadius: '10px',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  transition: 'all 0.2s',
  minHeight: '100px',
});

export const navBackBtnStyle = {
  backgroundColor: 'transparent',
  border: 'none',
  color: '#475569',
  cursor: 'pointer',
  fontSize: '0.9375rem',
  fontWeight: '600',
  padding: '0.375rem 0.625rem',
  borderRadius: '6px',
  transition: 'all 0.15s',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem',
};

export const filterChipStyle = (color) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.3rem 0.75rem',
  backgroundColor: `${color}12`,
  border: `1px solid ${color}30`,
  color: color,
  borderRadius: '20px',
  fontSize: '0.8125rem',
  fontWeight: '600',
  cursor: 'pointer',
  transition: 'background-color 0.15s',
});
