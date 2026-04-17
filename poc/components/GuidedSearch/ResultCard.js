import { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * Single search result card.
 * Manages its own isMobile state via window resize listener.
 */
const ResultCard = ({ result, catMeta, defaultThumbnail }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const accentColor = catMeta ? catMeta.color : '#10c6c5';

  return (
    <a
      href={`/directory/${result.slug.replace(/^\//, '')}`}
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? '0' : '1.5rem',
        backgroundColor: '#fff',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        textDecoration: 'none',
        color: 'inherit',
        border: '1px solid #f1f5f9',
        transition: 'box-shadow 0.2s, transform 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{
        position: 'relative',
        width: isMobile ? '100%' : '200px',
        minWidth: isMobile ? 'auto' : '200px',
        height: isMobile ? '180px' : 'auto',
        backgroundColor: '#f8fafc',
      }}>
        <Image
          src={result.thumbnail || defaultThumbnail}
          alt={result.title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{
        flex: 1,
        padding: isMobile ? '1.25rem' : '1.25rem 1.25rem 1.25rem 0',
      }}>
        {result.category_name && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            padding: '0.2rem 0.625rem',
            backgroundColor: `${accentColor}18`,
            color: accentColor,
            borderRadius: '6px',
            fontSize: isMobile ? '0.6875rem' : '0.75rem',
            fontWeight: '600',
            marginBottom: '0.5rem',
            letterSpacing: '0.02em',
            textTransform: 'uppercase',
            maxWidth: 'fit-content',
          }}>
            {result.category_name}
          </div>
        )}
        <h2 style={{
          fontSize: isMobile ? '1rem' : '1.125rem',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 0.375rem',
          lineHeight: '1.3',
        }}>
          {result.title}
        </h2>
        {result.city && result.state_province && (
          <p style={{
            fontSize: '0.875rem',
            color: '#64748b',
            margin: '0 0 0.75rem',
          }}>
            📍 {result.city}, {result.state_province}
            {result.distance ? ` · ${result.distance}` : ''}
          </p>
        )}
        <p style={{
          fontSize: '0.9rem',
          color: '#475569',
          lineHeight: '1.6',
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: isMobile ? 3 : 4,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {result.summary || result.content || ''}
        </p>
        <div style={{
          marginTop: '0.875rem',
          fontSize: '0.875rem',
          fontWeight: '600',
          color: accentColor,
        }}>
          View Details →
        </div>
      </div>
    </a>
  );
};

export default ResultCard;
