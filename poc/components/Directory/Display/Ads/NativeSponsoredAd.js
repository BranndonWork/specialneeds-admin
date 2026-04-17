import Image from 'next/image';

// Inline sponsored/editorial content block — appears in the main column after the body+factbox.
// data: { image?, title, subtitle?, href, linkText? }
const NativeSponsoredAd = ({ data, accentColor = '#c25b0a' }) => {
  if (!data?.title) return null;

  return (
    <div style={{ background: '#f5f0ea', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', border: '1px solid #e8e0d8' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#94a3b8', marginBottom: '0.875rem' }}>
        FROM SPECIALNEEDS.COM · SPONSORED CONTENT
      </div>
      <div className="row g-3 align-items-center">
        {data.image && (
          <div className="col-md-auto">
            <Image src={data.image} alt="" width={120} height={90} style={{ objectFit: 'cover', borderRadius: '8px' }} />
          </div>
        )}
        <div className="col-md">
          <div style={{ fontFamily: 'Georgia, serif', fontSize: '1.0625rem', fontWeight: '700', color: '#2d2416', marginBottom: '0.375rem', lineHeight: '1.3' }}>
            {data.title}
          </div>
          {data.subtitle && (
            <div style={{ fontSize: '0.8125rem', color: '#6b5e4e', marginBottom: '0.75rem' }}>{data.subtitle}</div>
          )}
          <a href={data.href || '/articles'} style={{ color: accentColor, fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none' }}>
            {data.linkText || 'Read the guide'} →
          </a>
        </div>
      </div>
    </div>
  );
};

export default NativeSponsoredAd;
