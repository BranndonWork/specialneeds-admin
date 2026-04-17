import Image from 'next/image';
import BaseTemplate from '../../BaseTemplate';
import { CATEGORIES } from '@config/categoryConfig';
import ListingBreadcrumb from '@components/Directory/Display/ListingBreadcrumb';

const { color: ACCENT_COLOR, accentLight: ACCENT_LIGHT, accentOnDark: ACCENT_ON_DARK } = CATEGORIES.find((c) => c.slug === 'therapeutic');

const renderSpeechTherapistHero = ({ listingData, accentColor, statusBadge, navH }) => {
  const headshot = listingData.images?.[0]?.url || null;
  const addr = listingData.address || {};
  const city = addr.city || '';
  const state = addr.state_province || addr.state || '';
  const phone = listingData.phone || '';

  return (
    <div style={{ background: `linear-gradient(135deg, #0a1628 0%, #0f2040 60%, ${accentColor} 100%)`, paddingTop: navH, paddingBottom: '2.5rem', marginBottom: '2rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '1.75rem' }}>
          <ListingBreadcrumb listingData={listingData} />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          {headshot && (
            <div style={{ flexShrink: 0 }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden', border: `3px solid ${accentColor}`, boxShadow: '0 4px 24px rgba(0,0,0,0.4)', position: 'relative' }}>
                <Image src={headshot} alt={listingData.title} fill style={{ objectFit: "cover", objectPosition: "center top" }} />
              </div>
            </div>
          )}
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
                <span style={{ background: statusBadge.color, color: '#fff', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '700', padding: '0.25rem 0.625rem' }}>
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
  ['Age Groups',   fmt(get(categoryData, 'conditions_and_services', 'age_groups_served'))],
  ['Credentials',  fmt(get(categoryData, 'provider_details', 'credentials'))],
  ['Languages',    fmt(get(categoryData, 'provider_details', 'languages'))],
  ['Insurance',    fmt(get(categoryData, 'availability_and_insurance', 'insurance_accepted'))],
  ['Telehealth',   get(categoryData, 'availability_and_insurance', 'telehealth_available') === true ? 'Available' : null],
].filter(([, v]) => v);

const getStatusBadge = (categoryData) => {
  const telehealth = get(categoryData, 'availability_and_insurance', 'telehealth_available');
  if (telehealth === true) return { text: 'Telehealth Available', color: '#0891b2' };
  return { text: 'Accepting Clients', color: '#16a34a' };
};

const getCredentialCallout = (categoryData) => {
  const credentials = get(categoryData, 'provider_details', 'credentials');
  const primary = Array.isArray(credentials) && credentials[0];
  if (!primary) return null;
  return {
    title: 'Credentials',
    icon: 'bx-id-card',
    name: primary,
    org: credentials.length > 1 ? credentials.slice(1).join(', ') : null,
  };
};

// Conditions treated and procedures get prominent pill treatment —
// these are what families are searching for when they land on this page.
const renderConditionsAndServices = (section, accentColor) => {
  const conditionsBg = '#0e7490';
  const proceduresBg = accentColor;

  const conditionsField = section.fields?.conditions_treated;
  const proceduresField = section.fields?.procedures;
  const ageField        = section.fields?.age_groups_served;

  const conditions = Array.isArray(conditionsField?.attributes?.value) ? conditionsField.attributes.value : [];
  const procedures  = Array.isArray(proceduresField?.attributes?.value) ? proceduresField.attributes.value : [];
  const ages        = Array.isArray(ageField?.attributes?.value) ? ageField.attributes.value : [];

  if (!conditions.length && !procedures.length && !ages.length) return null;

  const renderPillGroup = (label, items, bg) => {
    if (!items.length) return null;
    return (
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b5e4e', marginBottom: '0.5rem' }}>{label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
          {items.map((tag, i) => (
            <span key={i} style={{ background: bg, color: '#fff', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '600', padding: '0.25rem 0.625rem' }}>{tag}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {section.label}
      </h2>
      {renderPillGroup(conditionsField?.label || 'Conditions Treated', conditions, conditionsBg)}
      {renderPillGroup(proceduresField?.label || 'Procedures & Therapies', procedures, proceduresBg)}
      {renderPillGroup(ageField?.label || 'Age Groups Served', ages, '#475569')}
    </div>
  );
};

const SECTION_OVERRIDES = {
  conditions_and_services: renderConditionsAndServices,
};

const SpeechTherapyTemplate = ({ listing }) => {
  const categoryData = listing.category_data;

  return (
    <BaseTemplate
      listing={listing}
      accentColor={ACCENT_COLOR}
      accentLight={ACCENT_LIGHT}
      accentOnDark={ACCENT_ON_DARK}
      factboxItems={getFactboxItems(categoryData)}
      credentialCallout={getCredentialCallout(categoryData)}
      contactHeading="Contact the speech therapist"
      statusBadge={getStatusBadge(categoryData)}
      sectionOverrides={SECTION_OVERRIDES}
      renderHero={renderSpeechTherapistHero}
    />
  );
};

export default SpeechTherapyTemplate;
