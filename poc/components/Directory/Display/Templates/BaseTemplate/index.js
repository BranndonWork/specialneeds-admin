import { useState } from 'react';
import Image from 'next/image';
import ClaimListingModal from "@components/Directory/Display/ClaimListingModal";
import DisplayContent from "@components/Directory/Display/Content";
import ContentSource from "@components/Directory/Display/ContentSource";
import FAQS from "@components/Directory/Display/FAQs";
import Reviews from "@components/Directory/Display/Reviews";
import NativeSponsoredAd from "@components/Directory/Display/Ads/NativeSponsoredAd";
import SidebarHouseAd from "@components/Directory/Display/Ads/SidebarHouseAd";
import SidebarArticleRecs from "@components/Directory/Display/Ads/SidebarArticleRecs";
import ClaimListingWidget from "@components/Directory/Display/ClaimListingWidget";

import useNavbarHeight from "@hooks/useNavbarHeight";
import useAd from "@hooks/useAd";
import config from "@config/config";
import ListingBreadcrumb from "@components/Directory/Display/ListingBreadcrumb";
import isExternalUrl from "@lib/isExternalUrl";

const FieldValue = ({ val, accentColor }) => {
  if (val === true) return 'Yes';
  if (val === false) return 'No';
  if (isExternalUrl(val)) {
    const url = val.trim();
    const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, textDecoration: 'none', fontWeight: '600', wordBreak: 'break-word' }}>
        {display}
      </a>
    );
  }
  return val;
};

const BaseTemplate = ({
  listing,
  accentColor = '#c25b0a',
  accentLight = '#fff5ee',
  accentOnDark = '#d86514',
  factboxItems = [],
  credentialCallout = null,
  contactHeading = 'Contact',
  statusBadge = null,
  articleRecs = [],
  sectionOverrides = {},
  renderHero = null,
  fallbackHeroImage = null,
}) => {
  const navH = useNavbarHeight();
  const sidebarAd = useAd('sidebar_listing');
  const inFeedAd = useAd('in_content_listing');
  const claimed_by = listing.listing_data?.claimed_by;
  const isClaimed = claimed_by && Object.keys(claimed_by).length > 0;
  const claimable = config.claimListingEnabled && !isClaimed;
  const [mobileClaimOpen, setMobileClaimOpen] = useState(false);

  const listingData = listing.listing_data;
  const categoryData = listing.category_data;

  const sidebarAdData = sidebarAd ? {
    label: sidebarAd.disclosure_label,
    headline: sidebarAd.title,
    subline: sidebarAd.description,
    href: sidebarAd.destination_url,
    ctaText: sidebarAd.cta_text,
  } : null;

  const inFeedAdData = inFeedAd ? {
    image: inFeedAd.image,
    title: inFeedAd.title,
    subtitle: inFeedAd.description,
    href: inFeedAd.destination_url,
    linkText: inFeedAd.cta_text,
  } : null;

  const heroImage = listingData.images?.[1]?.url || listingData.images?.[0]?.url || null;
  const addr = listingData.address || {};
  const city = addr.city || '';
  const state = addr.state_province || addr.state || '';
  const street = addr.street_1 || addr.street || '';
  const postal = addr.postal_code || addr.zip || '';
  const phone = listingData.phone || '';

  const visibleSections = Object.entries(categoryData || {}).filter(([, section]) =>
    Object.values(section.fields || {}).some((f) => {
      const v = f.attributes?.value;
      return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
    })
  );

  return (
    <div style={{ background: '#fafaf8', paddingBottom: '5rem' }}>
      <style jsx>{`
        .factbox { border: 2px solid #e8e0d8; border-radius: 10px; padding: 1.25rem; }
        .factbox-row { display: flex; justify-content: space-between; padding: 0.5rem 0; border-bottom: 1px solid #f5f0ea; font-size: 0.875rem; }
        .factbox-row:last-child { border-bottom: none; }
        .mobile-sticky { position: fixed; bottom: 0; left: 0; right: 0; background: #fff; border-top: 2px solid ${accentColor}; padding: 0.875rem 1rem; z-index: 999; display: flex; gap: 0.75rem; }
        @media (min-width: 992px) { .mobile-sticky { display: none; } }
      `}</style>

      {/* Hero — full-bleed default, or custom renderer per category */}
      {renderHero ? renderHero({ listingData, accentColor, accentLight, statusBadge, navH }) : null}

      {/* Full-bleed Hero (default) */}
      {!renderHero && <div style={{ position: 'relative', height: '65vh', minHeight: '400px', maxHeight: '600px', overflow: 'hidden', marginBottom: '2.5rem', marginTop: navH }}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt={listingData.title}
            fill
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: fallbackHeroImage ? `url(${fallbackHeroImage}) center / cover no-repeat` : '#1e1410' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,8,5,0.92) 0%, rgba(10,8,5,0.3) 50%, rgba(10,8,5,0.15) 100%)' }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: '1.25rem', left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', padding: '0 1rem' }}>
          <ListingBreadcrumb listingData={listingData} />
        </div>

        {/* Hero Content */}
        <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: '1200px', padding: '2rem 1.5rem' }}>
          <div style={{ display: 'inline-block', background: accentColor, color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', marginBottom: '0.875rem' }}>
            {listingData.category?.parent?.name && `${listingData.category.parent.name} · `}{listingData.category?.name}
          </div>
          <h1 style={{ fontSize: 'clamp(1.75rem, 4vw, 3rem)', fontWeight: '900', color: '#fff', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '1rem', maxWidth: '700px' }}>
            {listingData.title}
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {(city || state) && (
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                <i className="bx bx-map" style={{ fontSize: '1rem' }} />
                {[city, state].filter(Boolean).join(', ')}
              </span>
            )}
            {statusBadge && (
              <span style={{ background: statusBadge.color || '#16a34a', color: '#fff', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '700', padding: '0.25rem 0.625rem' }}>
                {statusBadge.text}
              </span>
            )}
            {phone && (
              <a
                href={`tel:${phone.replace(/\D/g, '')}`}
                style={{ background: accentColor, color: '#fff', borderRadius: '8px', padding: '0.875rem 2rem', fontWeight: '800', textDecoration: 'none', fontSize: '1.0625rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', letterSpacing: '0.01em' }}
              >
                <i className="bx bx-phone" style={{ fontSize: '1.25rem' }} />
                {phone}
              </a>
            )}
          </div>
        </div>
      </div>}

      <div className="container">
        <div className="row">

          {/* Main column */}
          <div className="col-lg-8">

            {/* Summary lede */}
            {listingData.summary && (
              <div style={{ borderLeft: `4px solid ${accentColor}`, paddingLeft: '1.25rem', marginBottom: '2rem' }}>
                <p style={{ fontSize: '1.1875rem', fontWeight: '500', color: '#2d2416', lineHeight: '1.65', fontFamily: 'Georgia, "Times New Roman", serif', margin: 0, fontStyle: 'italic' }}>
                  {listingData.summary}
                </p>
              </div>
            )}

            {/* Body + factbox */}
            <div className="row g-3 mb-4">
              <div className="col-md-7">
                <div style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.0625rem', color: '#2d2416', lineHeight: '1.8' }}>
                  <DisplayContent content={listingData} />
                </div>
              </div>
              <div className="col-md-5">
                {factboxItems.length > 0 && (
                  <div className="factbox" style={{ marginBottom: credentialCallout ? '1.25rem' : 0 }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', color: accentColor, marginBottom: '0.75rem' }}>At a Glance</div>
                    {factboxItems.map(([k, v]) => v ? (
                      <div key={k} className="factbox-row">
                        <span style={{ color: '#6b5e4e', fontWeight: '600', fontSize: '0.8125rem' }}>{k}</span>
                        <span style={{ color: '#2d2416', fontWeight: '700', fontSize: '0.8125rem', textAlign: 'right', maxWidth: '55%' }}>{v}</span>
                      </div>
                    ) : null)}
                  </div>
                )}
                {credentialCallout && (
                  <div style={{ background: accentLight, borderRadius: '10px', padding: '1.125rem', border: `1px solid #f5dcc8` }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: accentColor, marginBottom: '0.625rem' }}>{credentialCallout.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', background: accentColor, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`bx ${credentialCallout.icon || 'bx-award'}`} style={{ color: '#fff', fontSize: '1.5rem' }} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', color: '#2d2416', fontSize: '0.9375rem' }}>{credentialCallout.name}</div>
                        {credentialCallout.org && <div style={{ fontSize: '0.8125rem', color: '#6b5e4e' }}>{credentialCallout.org}</div>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sponsored / editorial content */}
            <NativeSponsoredAd data={inFeedAdData} accentColor={accentColor} />

            {/* Category data — magazine table style, with per-section overrides */}
            {visibleSections.map(([sectionKey, section]) => {
              if (sectionOverrides[sectionKey]) {
                return <div key={sectionKey}>{sectionOverrides[sectionKey](section, accentColor)}</div>;
              }
              const visibleFields = Object.entries(section.fields || {}).filter(([, f]) => {
                const v = f.attributes?.value;
                return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
              });
              return (
                <div key={sectionKey} style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '0' }}>
                    {section.label}
                  </h2>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {visibleFields.map(([fieldKey, field]) => {
                        const v = field.attributes?.value;
                        const values = Array.isArray(v) ? v : [v];
                        return (
                          <tr key={fieldKey} style={{ borderBottom: '1px solid #f0ece6' }}>
                            <td style={{ padding: '0.625rem 0', color: '#6b5e4e', fontSize: '0.875rem', fontWeight: '500', width: '200px', verticalAlign: 'top', paddingRight: '1rem' }}>{field.label}</td>
                            <td style={{ padding: '0.625rem 0', color: '#2d2416', fontSize: '0.9375rem', fontWeight: '700', verticalAlign: 'top' }}>
                              {values.map((val, i) => (
                                <span key={i}>{i > 0 && ' · '}<FieldValue val={val} accentColor={accentColor} /></span>
                              ))}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              );
            })}

            {/* FAQs */}
            {listingData.faqs?.length > 0 && (
              <>
                <hr style={{ margin: '2rem 0' }} />
                <FAQS faqs={listingData.faqs} />
              </>
            )}

            {/* Reviews */}
            {config.listingReviewsEnabled && (
              <Reviews listing={listing} enableAddReview={true} />
            )}

            <ContentSource content={listing} />
          </div>

          {/* Sidebar */}
          <div className="col-lg-4 d-none d-lg-block">
            <div style={{ position: 'sticky', top: '90px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

              {/* Contact card */}
              <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e8e0d8', padding: '1.5rem', boxShadow: '0 2px 12px rgba(194,91,10,0.07)' }}>
                <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', marginBottom: '1.25rem' }}>{contactHeading}</h3>
                {phone && (
                  <a href={`tel:${phone.replace(/\D/g, '')}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: accentColor, color: '#fff', borderRadius: '8px', padding: '0.875rem', fontWeight: '800', textDecoration: 'none', fontSize: '1rem', marginBottom: '1rem' }}>
                    <i className="bx bx-phone" style={{ fontSize: '1.25rem' }} />
                    {phone}
                  </a>
                )}
                {(street || city) && (
                  <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: '#6b5e4e', marginBottom: '0.75rem', alignItems: 'flex-start' }}>
                    <i className="bx bx-map" style={{ color: accentColor, fontSize: '1.125rem', flexShrink: 0, marginTop: '0.1rem' }} />
                    <span>{[street, city, [state, postal].filter(Boolean).join(' ')].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {listingData.website && (
                  <a href={listingData.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: accentColor, textDecoration: 'none', fontWeight: '600', alignItems: 'center' }}>
                    <i className="bx bx-link-external" style={{ fontSize: '1.125rem' }} />
                    {listingData.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                  </a>
                )}
              </div>

              {/* Claim listing */}
              {claimable && <ClaimListingWidget listing={listing} accentColor={accentColor} />}

              {/* House ad */}
              <SidebarHouseAd data={sidebarAdData} accentColor={accentColor} accentOnDark={accentOnDark} />

              {/* Article recommendations */}
              <SidebarArticleRecs articles={articleRecs} />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile sticky footer */}
      {(phone || claimable) && (
        <div className="mobile-sticky">
          {phone && (
            <a href={`tel:${phone.replace(/\D/g, '')}`} style={{ flex: 2, background: accentColor, color: '#fff', borderRadius: '8px', padding: '0.875rem', fontWeight: '800', textDecoration: 'none', textAlign: 'center', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem' }}>
              <i className="bx bx-phone" style={{ fontSize: '1.125rem' }} /> {phone}
            </a>
          )}
          {claimable && (
            <>
              <button
                onClick={() => setMobileClaimOpen(true)}
                style={{ flex: 1, background: 'transparent', border: `2px solid ${accentColor}`, color: accentColor, borderRadius: '8px', padding: '0.875rem', fontWeight: '700', fontSize: '0.875rem', cursor: 'pointer' }}
              >
                Claim Listing
              </button>
              {mobileClaimOpen && (
                <ClaimListingModal listing={listing} accentColor={accentColor} onClose={() => setMobileClaimOpen(false)} />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BaseTemplate;
