import BaseTemplate from '../../BaseTemplate';
import cloudflareImages from '../../../../../../utils/cloudflareImages';
import { CATEGORIES } from '@config/categoryConfig';

const { color: ACCENT_COLOR, accentLight: ACCENT_LIGHT, accentOnDark: ACCENT_ON_DARK } = CATEGORIES.find((c) => c.slug === 'recreational-activities');

const get = (categoryData, section, field) =>
  categoryData?.[section]?.fields?.[field]?.attributes?.value;

const fmt = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  return String(v);
};

const getAgeRange = (categoryData) => {
  const coedMin  = get(categoryData, 'camper_age_groups', 'co_ed_age_min');
  const coedMax  = get(categoryData, 'camper_age_groups', 'co_ed_age_max');
  const boysMin  = get(categoryData, 'camper_age_groups', 'boys_age_min');
  const boysMax  = get(categoryData, 'camper_age_groups', 'boys_age_max');
  const girlsMin = get(categoryData, 'camper_age_groups', 'girls_age_min');
  const girlsMax = get(categoryData, 'camper_age_groups', 'girls_age_max');

  if (coedMin && coedMax) return `Ages ${coedMin}–${coedMax}`;
  const parts = [];
  if (boysMin && boysMax) parts.push(`Boys ${boysMin}–${boysMax}`);
  if (girlsMin && girlsMax) parts.push(`Girls ${girlsMin}–${girlsMax}`);
  return parts.length ? parts.join(', ') : null;
};

const getFactboxItems = (categoryData) => [
  ['Stay',          fmt(get(categoryData, 'camp_basics', 'camp_stay'))],
  ['Ages',          getAgeRange(categoryData)],
  ['Financial Aid', get(categoryData, 'camp_basics', 'financial_aid_available') === true ? 'Available' : null],
  ['Transportation', get(categoryData, 'camp_basics', 'transportation_available') === true ? 'Available' : null],
  ['Family Camp',   get(categoryData, 'camp_basics', 'family_camp') === true ? 'Yes' : null],
  ['Director',      fmt(get(categoryData, 'camp_leadership', 'director'))],
].filter(([, v]) => v);

// Session details — repeater type, rendered as cards
const renderSessionDetails = (section, accentColor) => {
  const sessions = get({ camp_sessions: section }, 'camp_sessions', 'session_details');
  const validSessions = Array.isArray(sessions)
    ? sessions.filter((s) => s && (s.starts_on?.value || s.cost?.value || s.length?.value))
    : [];

  if (!validSessions.length) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {section.label}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {validSessions.map((session, i) => (
          <div key={i} style={{ border: '1px solid #e8e0d8', borderRadius: '8px', padding: '1rem', background: '#fff', display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'flex-start' }}>
            {session.starts_on?.value && (
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.25rem' }}>Dates</div>
                <div style={{ fontWeight: '700', color: '#2d2416', fontSize: '0.9375rem' }}>
                  {session.starts_on.value}{session.ends_on?.value ? ` – ${session.ends_on.value}` : ''}
                </div>
              </div>
            )}
            {session.length?.value && (
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.25rem' }}>Length</div>
                <div style={{ fontWeight: '700', color: '#2d2416', fontSize: '0.9375rem' }}>{session.length.value}</div>
              </div>
            )}
            {session.cost?.value && (
              <div>
                <div style={{ fontSize: '0.6875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8', marginBottom: '0.25rem' }}>Cost</div>
                <div style={{ fontWeight: '800', color: accentColor, fontSize: '1rem' }}>{session.cost.value}</div>
              </div>
            )}
            {session.notes?.value && (
              <div style={{ flexBasis: '100%' }}>
                <div style={{ fontSize: '0.8125rem', color: '#6b5e4e' }}>{session.notes.value}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Activities rendered as badge pills
const renderActivities = (section, accentColor) => {
  const badgeKeys = ['featured_activities', 'additional_activities', 'targeted_focus', 'specialty_clientele'];
  const tableKeys = ['cultural_focus', 'health_related_affiliations', 'religious_affiliations', 'independent_affiliations', 'agencies_clubs'];

  const populated = badgeKeys
    .map((key) => ({ key, field: section.fields?.[key] }))
    .filter(({ field }) => Array.isArray(field?.attributes?.value) && field.attributes.value.length > 0);

  const tableRows = tableKeys
    .map((key) => ({ key, field: section.fields?.[key] }))
    .filter(({ field }) => Array.isArray(field?.attributes?.value) && field.attributes.value.length > 0);

  if (!populated.length && !tableRows.length) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {section.label}
      </h2>
      {populated.map(({ key, field }) => (
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
      {tableRows.map(({ key, field }) => (
        <div key={key} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderTop: '1px solid #f0ece6', fontSize: '0.875rem' }}>
          <span style={{ color: '#6b5e4e', fontWeight: '600', minWidth: '160px' }}>{field.label}</span>
          <span style={{ color: '#2d2416', fontWeight: '600' }}>{field.attributes.value.join(', ')}</span>
        </div>
      ))}
    </div>
  );
};

const SECTION_OVERRIDES = {
  camp_sessions: renderSessionDetails,
  camp_activities_and_focus: renderActivities,
};

const FALLBACK_HERO_IMAGE = cloudflareImages.getUrl('fallbackCamps');

const getStatusBadge = (categoryData) => {
  const campStay = fmt(get(categoryData, 'camp_basics', 'camp_stay'));
  if (campStay) return { text: campStay, color: ACCENT_COLOR };
  const ageRange = getAgeRange(categoryData);
  if (ageRange) return { text: ageRange, color: ACCENT_COLOR };
  return null;
};

const CampsTemplate = ({ listing }) => {
  const categoryData = listing.category_data;

  return (
    <BaseTemplate
      listing={listing}
      accentColor={ACCENT_COLOR}
      accentLight={ACCENT_LIGHT}
      accentOnDark={ACCENT_ON_DARK}
      factboxItems={getFactboxItems(categoryData)}
      credentialCallout={null}
      contactHeading="Contact the camp"
      statusBadge={getStatusBadge(categoryData)}
      sectionOverrides={SECTION_OVERRIDES}
      fallbackHeroImage={FALLBACK_HERO_IMAGE}
    />
  );
};

export default CampsTemplate;
