import Link from 'next/link';

const LINK_STYLE = { color: 'rgba(255,255,255,0.75)', textDecoration: 'none' };

// Shared breadcrumb for listing hero sections.
// Handles its own pill styling — the parent is responsible for positioning.
const ListingBreadcrumb = ({ listingData }) => (
  <span style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.85)', background: 'rgba(0,0,0,0.65)', borderRadius: '6px', padding: '0.25rem 0.625rem', display: 'inline-block' }}>
    <Link href="/" style={LINK_STYLE}>Home</Link>
    {' › '}
    <Link href="/directory" style={LINK_STYLE}>Directory</Link>
    {listingData.category?.parent?.slug && (
      <>
        {' › '}
        <Link href={`/directory/?category=${listingData.category.parent.slug}`} style={LINK_STYLE}>
          {listingData.category.parent.name}
        </Link>
      </>
    )}
    {' › '}
    <span style={{ color: '#fff' }}>{listingData.title}</span>
  </span>
);

export default ListingBreadcrumb;
