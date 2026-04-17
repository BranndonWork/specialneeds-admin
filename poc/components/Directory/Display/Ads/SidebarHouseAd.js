// Sidebar house ad — dark header with CTA button.
// data: { label?, headline, subline?, href, ctaText? }
const SidebarHouseAd = ({ data, accentColor = '#c25b0a', accentOnDark = '#d86514' }) => {
  if (!data?.headline) return null;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e0d8', overflow: 'hidden', boxShadow: '0 2px 12px rgba(194,91,10,0.07)' }}>
      <div style={{ background: 'rgb(13, 35, 24)', padding: '1.5rem' }}>
        {data.label && (
          <div style={{ fontSize: '0.6875rem', color: accentOnDark, textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '700', marginBottom: '0.5rem' }}>
            {data.label}
          </div>
        )}
        <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.25rem', color: '#fff', fontWeight: '700', lineHeight: '1.3', marginBottom: data.subline ? '0.375rem' : 0 }}>
          {data.headline}
        </div>
        {data.subline && (
          <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.65)' }}>{data.subline}</div>
        )}
      </div>
      <div style={{ padding: '1.25rem' }}>
        <a
          href={data.href || '/directory'}
          style={{ display: 'block', background: accentColor, color: '#fff', borderRadius: '6px', padding: '0.875rem', fontWeight: '800', textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem' }}
        >
          {data.ctaText || 'Search Directory'}
        </a>
      </div>
    </div>
  );
};

export default SidebarHouseAd;
