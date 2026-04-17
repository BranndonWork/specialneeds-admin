import Image from 'next/image';
import BaseTemplate from '../../BaseTemplate';
import { CATEGORIES } from '@config/categoryConfig';
import ListingBreadcrumb from '@components/Directory/Display/ListingBreadcrumb';

const { color: ACCENT_COLOR, accentLight: ACCENT_LIGHT, accentOnDark: ACCENT_ON_DARK } = CATEGORIES.find((c) => c.slug === 'counseling');

const renderTherapistHero = ({ listingData, accentColor, statusBadge, navH }) => {
  const headshot = listingData.images?.[0]?.url || null;
  const addr = listingData.address || {};
  const city = addr.city || '';
  const state = addr.state_province || addr.state || '';
  const phone = listingData.phone || '';

  return (
    <div style={{ background: `linear-gradient(135deg, #0f0a1e 0%, #1a1535 60%, ${accentColor} 100%)`, paddingTop: navH, paddingBottom: '2.5rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Breadcrumb */}
        <div style={{ marginBottom: '1.75rem' }}>
          <ListingBreadcrumb listingData={listingData} />
        </div>

        {/* Hero content: avatar + info */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>

          {/* Avatar */}
          {headshot && (
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '140px', height: '140px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${accentColor}`, boxShadow: '0 4px 24px rgba(0,0,0,0.4)', position: 'relative' }}>
                <Image src={headshot} alt={listingData.title} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>
            </div>
          )}

          {/* Info */}
          <div style={{ flex: 1, minWidth: '240px' }}>
            <div style={{ display: 'inline-block', background: accentColor, color: '#fff', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.25rem 0.75rem', marginBottom: '0.75rem' }}>
              {listingData.category?.parent?.name && `${listingData.category.parent.name} · `}{listingData.category?.name}
            </div>
            <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#fff', letterSpacing: '-0.02em', lineHeight: '1.15', marginBottom: '1rem' }}>
              {listingData.title}
            </h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.875rem', alignItems: 'center' }}>
              {(city || state) && (
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9375rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
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
                <a href={`tel:${phone.replace(/\D/g, '')}`} style={{ background: accentColor, color: '#fff', borderRadius: '8px', padding: '0.75rem 1.75rem', fontWeight: '800', textDecoration: 'none', fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                  <i className="bx bx-phone" style={{ fontSize: '1.25rem' }} />
                  {phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const get = (categoryData, section, field) =>
  categoryData?.[section]?.fields?.[field]?.attributes?.value;

const fmt = (v) => {
  if (!v) return null;
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  return v;
};

const getFactboxItems = (categoryData) => [
  ['Age Groups',   fmt(get(categoryData, 'basic_information', 'age_groups'))],
  ['Specialties',  fmt(get(categoryData, 'modalities_and_specialties', 'specialties'))],
  ['Insurance',    fmt(get(categoryData, 'availability_and_payment_options', 'insurance_plans'))],
  ['Fees',         fmt(get(categoryData, 'availability_and_payment_options', 'fees'))],
  ['Waitlist',     fmt(get(categoryData, 'availability_and_payment_options', 'waitlist_status'))],
  ['Online',       get(categoryData, 'availability_and_payment_options', 'offers_online_therapy') === true ? 'Yes' : null],
  ['Member of',    fmt(get(categoryData, 'basic_information', 'membership'))],
].filter(([, v]) => v);

const getStatusBadge = (categoryData) => {
  const waitlist = fmt(get(categoryData, 'availability_and_payment_options', 'waitlist_status'));
  if (!waitlist) return { text: 'Accepting Clients', color: '#16a34a' };
  return { text: waitlist, color: '#f59e0b' };
};

const getCredentialCallout = (categoryData) => {
  const credentials = get(categoryData, 'education_and_training', 'credentials');
  const licenses    = get(categoryData, 'basic_information', 'licenses');
  const primary = (Array.isArray(credentials) && credentials[0]) ||
                  (Array.isArray(licenses) && licenses[0]) ||
                  null;
  if (!primary) return null;
  return {
    title: 'Credentials',
    icon: 'bx-id-card',
    name: primary,
    org: Array.isArray(credentials) && credentials.length > 1
      ? credentials.slice(1).join(', ')
      : null,
  };
};

// Renders issues, modalities, and specialties as badge pills instead of table rows
const renderModalities = (section, accentColor) => {
  const badgeFields = ['issues', 'modalities', 'specialties', 'client_focus_participants'];
  const tableFields = ['therapy_types'];

  const badgeSections = badgeFields
    .map((key) => ({ key, field: section.fields?.[key] }))
    .filter(({ field }) => {
      const v = field?.attributes?.value;
      return Array.isArray(v) && v.length > 0;
    });

  const tableRows = tableFields
    .map((key) => ({ key, field: section.fields?.[key] }))
    .filter(({ field }) => {
      const v = field?.attributes?.value;
      return v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0);
    });

  if (!badgeSections.length && !tableRows.length) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {section.label}
      </h2>

      {badgeSections.map(({ key, field }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b5e4e', marginBottom: '0.5rem' }}>
            {field.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {field.attributes.value.map((tag, i) => (
              <span key={i} style={{ background: accentColor, color: '#fff', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '600', padding: '0.25rem 0.625rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}

      {tableRows.map(({ key, field }) => {
        const v = field.attributes?.value;
        const values = Array.isArray(v) ? v : [v];
        return (
          <div key={key} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderTop: '1px solid #f0ece6', fontSize: '0.875rem' }}>
            <span style={{ color: '#6b5e4e', fontWeight: '600', minWidth: '140px' }}>{field.label}</span>
            <span style={{ color: '#2d2416', fontWeight: '700' }}>{values.join(' · ')}</span>
          </div>
        );
      })}
    </div>
  );
};

const SECTION_OVERRIDES = {
  modalities_and_specialties: renderModalities,
};

const TherapistsTemplate = ({ listing }) => {
  const categoryData = listing.category_data;

  return (
    <BaseTemplate
      listing={listing}
      accentColor={ACCENT_COLOR}
      accentLight={ACCENT_LIGHT}
      accentOnDark={ACCENT_ON_DARK}
      factboxItems={getFactboxItems(categoryData)}
      credentialCallout={getCredentialCallout(categoryData)}
      contactHeading="Contact the therapist"
      statusBadge={getStatusBadge(categoryData)}
      sectionOverrides={SECTION_OVERRIDES}
      renderHero={renderTherapistHero}
    />
  );
};

export default TherapistsTemplate;
