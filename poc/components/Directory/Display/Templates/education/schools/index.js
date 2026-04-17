import BaseTemplate from '../../BaseTemplate';
import { CATEGORIES } from '@config/categoryConfig';
import { serveAsset } from '@utils/assetHelpers';

const { color: ACCENT_COLOR, accentLight: ACCENT_LIGHT, accentOnDark: ACCENT_ON_DARK } = CATEGORIES.find((c) => c.slug === 'education');

const get = (categoryData, section, field) =>
  categoryData?.[section]?.fields?.[field]?.attributes?.value;

const fmt = (v) => {
  if (v === null || v === undefined || v === '') return null;
  if (Array.isArray(v)) return v.length ? v.join(', ') : null;
  return String(v);
};

const getFactboxItems = (categoryData) => [
  ['Type',      fmt(get(categoryData, 'school_information', 'school_type'))],
  ['Grades',    fmt(get(categoryData, 'school_information', 'grades_offered'))],
  ['Students',  fmt(get(categoryData, 'school_information', 'total_students'))],
  ['Class Size', (() => {
    const size = get(categoryData, 'school_information', 'average_class_size');
    return size ? `${size}:1 ratio` : null;
  })()],
  ['Tuition',   fmt(get(categoryData, 'school_information', 'yearly_tuition_cost'))],
  ['Fin. Aid',  (() => {
    const pct = get(categoryData, 'school_information', 'percent_on_financial_aid') ||
                get(categoryData, 'admissions_information', 'percent_on_financial_aid');
    return pct ? `${pct}% receive aid` : null;
  })()],
  ['Est.',      fmt(get(categoryData, 'school_information', 'year_founded'))],
  ['Deadline',  fmt(get(categoryData, 'admissions_information', 'admission_deadline'))],
].filter(([, v]) => v);

const getStatusBadge = (categoryData) => {
  const deadline = fmt(get(categoryData, 'admissions_information', 'admission_deadline'));
  if (!deadline) return null;
  const isRolling = /none|rolling/i.test(deadline);
  if (isRolling) return { text: 'Accepting Students', color: '#16a34a' };
  return { text: `Deadline: ${deadline}`, color: '#3b82f6' };
};

const getCredentialCallout = (categoryData) => {
  const memberships = get(categoryData, 'additional_information', 'school_memberships');
  const awards = get(categoryData, 'additional_information', 'awards');
  const primary = (Array.isArray(memberships) && memberships[0]) ||
                  (Array.isArray(awards) && awards[0]) ||
                  null;
  if (!primary) return null;
  return {
    title: 'Accreditation & Memberships',
    icon: 'bx-award',
    name: primary,
    org: Array.isArray(memberships) && memberships.length > 1
      ? memberships.slice(1).join(', ')
      : null,
  };
};

// Special ed and learning programs rendered as highlighted badge pills —
// these are the most critical fields for families using this directory.
const renderAcademicPrograms = (section, accentColor) => {
  const badgeConfigs = [
    { key: 'special_education_programs', bg: '#b91c1c', label: null },
    { key: 'learning_programs_supported', bg: accentColor, label: null },
    { key: 'advanced_courses', bg: '#6b5e4e', label: null },
    { key: 'ap_courses', bg: '#4c1d95', label: null },
    { key: 'list_of_courses_offered', bg: '#1e5f74', label: null },
  ];

  const tableKeys = ['matriculation_data'];

  const populated = badgeConfigs
    .map(({ key, bg }) => ({ key, bg, field: section.fields?.[key] }))
    .filter(({ field }) => {
      const v = field?.attributes?.value;
      return Array.isArray(v) && v.length > 0;
    });

  const tableRows = tableKeys
    .map((key) => ({ key, field: section.fields?.[key] }))
    .filter(({ field }) => {
      const v = field?.attributes?.value;
      return v !== null && v !== undefined && v !== '';
    });

  if (!populated.length && !tableRows.length) return null;

  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2 style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: '1.125rem', fontWeight: '700', color: '#2d2416', borderBottom: `3px solid ${accentColor}`, paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {section.label}
      </h2>
      {populated.map(({ key, bg, field }) => (
        <div key={key} style={{ marginBottom: '1rem' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#6b5e4e', marginBottom: '0.5rem' }}>
            {field.label}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
            {field.attributes.value.map((tag, i) => (
              <span key={i} style={{ background: bg, color: '#fff', borderRadius: '4px', fontSize: '0.8125rem', fontWeight: '600', padding: '0.25rem 0.625rem' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))}
      {tableRows.map(({ key, field }) => (
        <div key={key} style={{ display: 'flex', gap: '1rem', padding: '0.5rem 0', borderTop: '1px solid #f0ece6', fontSize: '0.875rem' }}>
          <span style={{ color: '#6b5e4e', fontWeight: '600', minWidth: '140px' }}>{field.label}</span>
          <a href={field.attributes.value} target="_blank" rel="noopener noreferrer" style={{ color: accentColor, fontWeight: '600' }}>View data</a>
        </div>
      ))}
    </div>
  );
};

const SECTION_OVERRIDES = {
  academic_programs_information: renderAcademicPrograms,
};

const SchoolsTemplate = ({ listing }) => {
  const categoryData = listing.category_data;

  return (
    <BaseTemplate
      listing={listing}
      accentColor={ACCENT_COLOR}
      accentLight={ACCENT_LIGHT}
      accentOnDark={ACCENT_ON_DARK}
      factboxItems={getFactboxItems(categoryData)}
      credentialCallout={getCredentialCallout(categoryData)}
      contactHeading="Contact the school"
      statusBadge={getStatusBadge(categoryData)}
      sectionOverrides={SECTION_OVERRIDES}
      fallbackHeroImage={serveAsset('fallbackSchools')}
    />
  );
};

export default SchoolsTemplate;
