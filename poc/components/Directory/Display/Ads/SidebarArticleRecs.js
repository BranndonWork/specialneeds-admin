// Sidebar article recommendations block.
// articles: [{ title, href }]
const SidebarArticleRecs = ({ articles = [], label = 'FROM SPECIALNEEDS.COM' }) => {
  if (!articles.length) return null;

  return (
    <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e0d8', padding: '1.5rem', boxShadow: '0 2px 12px rgba(194,91,10,0.07)' }}>
      <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94a3b8', marginBottom: '1rem' }}>
        {label}
      </div>
      {articles.map((rec, i) => (
        <div key={i} style={{ paddingBottom: '0.875rem', marginBottom: '0.875rem', borderBottom: i < articles.length - 1 ? '1px solid #f0ece6' : 'none' }}>
          <a
            href={rec.href || '/articles'}
            style={{ fontFamily: 'Georgia, serif', fontSize: '0.9375rem', color: '#2d2416', textDecoration: 'none', fontWeight: '600', lineHeight: '1.4', display: 'block' }}
          >
            {rec.title}
          </a>
        </div>
      ))}
    </div>
  );
};

export default SidebarArticleRecs;
