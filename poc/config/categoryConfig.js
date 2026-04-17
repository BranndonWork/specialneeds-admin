/**
 * Category taxonomy — shared across the platform.
 * Used by the guided search UI, listing templates, and any other consumers.
 */

export const CATEGORIES = [
  { slug: 'accessibility',               icon: '♿',  label: 'Accessibility',               color: '#6366f1', accentLight: '#eef2ff', accentOnDark: '#a5b4fc' },
  { slug: 'care',                        icon: '🤲',  label: 'Care',                        color: '#ec4899', accentLight: '#fdf2f8', accentOnDark: '#f9a8d4' },
  { slug: 'counseling',                  icon: '💬',  label: 'Counseling',                  color: '#8b5cf6', accentLight: '#f3f0ff', accentOnDark: '#c4b5fd' },
  { slug: 'education',                   icon: '🏫',  label: 'Education',                   color: '#3b82f6', accentLight: '#eff6ff', accentOnDark: '#93c5fd' },
  { slug: 'financial',                   icon: '💰',  label: 'Financial',                   color: '#10b981', accentLight: '#ecfdf5', accentOnDark: '#6ee7b7' },
  { slug: 'job-and-vocational',          icon: '💼',  label: 'Job & Vocational',            color: '#f59e0b', accentLight: '#fffbeb', accentOnDark: '#fcd34d' },
  { slug: 'legal',                       icon: '⚖️',  label: 'Legal',                       color: '#64748b', accentLight: '#f8fafc', accentOnDark: '#94a3b8' },
  { slug: 'medical',                     icon: '🏥',  label: 'Medical',                     color: '#ef4444', accentLight: '#fef2f2', accentOnDark: '#fca5a5' },
  { slug: 'nutrition-and-dietary',       icon: '🥗',  label: 'Nutrition & Dietary',         color: '#84cc16', accentLight: '#f7fee7', accentOnDark: '#bef264' },
  { slug: 'recreational-activities',     icon: '🏕️', label: 'Recreational Activities',    color: '#f97316', accentLight: '#fff7ed', accentOnDark: '#d86514' },
  { slug: 'residential-care',            icon: '🏠',  label: 'Residential Care',            color: '#0ea5e9', accentLight: '#f0f9ff', accentOnDark: '#7dd3fc' },
  { slug: 'social',                      icon: '🤝',  label: 'Social',                      color: '#a855f7', accentLight: '#faf5ff', accentOnDark: '#d8b4fe' },
  { slug: 'therapeutic',                 icon: '🧠',  label: 'Therapeutic',                 color: '#06b6d4', accentLight: '#ecfeff', accentOnDark: '#67e8f9' },
  { slug: 'training-for-care-providers', icon: '📋',  label: 'Training for Care Providers', color: '#78716c', accentLight: '#fafaf9', accentOnDark: '#a8a29e' },
  { slug: 'transportation',              icon: '🚌',  label: 'Transportation',              color: '#22c55e', accentLight: '#f0fdf4', accentOnDark: '#86efac' },
];

export const SUBCATEGORIES = {
  'accessibility': [
    { slug: null,                                  icon: '♿', label: 'All Accessibility' },
    { slug: 'accessibility-assessment',            icon: '📋', label: 'Assessment' },
    { slug: 'accessibility-compliance-consulting', icon: '✅', label: 'Compliance Consulting' },
    { slug: 'accessibility-inspection-services',   icon: '🔍', label: 'Inspection Services' },
    { slug: 'assistive-technology-consulting',     icon: '🦾', label: 'Assistive Technology' },
    { slug: 'disability-access-training-services', icon: '🎓', label: 'Access Training' },
    { slug: 'home-accessibility-modification',     icon: '🏡', label: 'Home Modification' },
    { slug: 'vehicle-accessibility-modification',  icon: '🚗', label: 'Vehicle Modification' },
  ],
  'care': [
    { slug: null,                               icon: '🤲', label: 'All Care' },
    { slug: 'adult-day-care',                   icon: '👴', label: 'Adult Day Care' },
    { slug: 'caregivers',                       icon: '👩‍⚕️', label: 'Caregivers' },
    { slug: 'child-day-care',                   icon: '👶', label: 'Child Day Care' },
    { slug: 'in-home-companion',                icon: '🏡', label: 'In-Home Companion' },
    { slug: 'in-home-home-health-aides',        icon: '💊', label: 'Home Health Aides' },
    { slug: 'in-home-nursing',                  icon: '🩺', label: 'In-Home Nursing' },
    { slug: 'in-home-personal-care-attendants', icon: '🙋', label: 'Personal Care' },
    { slug: 'in-home-therapy',                  icon: '🛋️', label: 'In-Home Therapy' },
    { slug: 'respite-care',                     icon: '☕', label: 'Respite Care' },
  ],
  'counseling': [
    { slug: null,                                    icon: '💬', label: 'All Counseling' },
    { slug: 'behavioral-consultation',               icon: '📊', label: 'Behavioral Consultation' },
    { slug: 'counselors',                            icon: '🗣️', label: 'Counselors' },
    { slug: 'licensed-special-needs-social-workers', icon: '👥', label: 'Social Workers' },
    { slug: 'psychologists',                         icon: '🧠', label: 'Psychologists' },
    { slug: 'therapists',                            icon: '🛋️', label: 'Therapists' },
  ],
  'education': [
    { slug: null,                    icon: '🏫', label: 'All Education' },
    { slug: 'schools',               icon: '🏫', label: 'Schools' },
    { slug: 'tutoring',              icon: '📚', label: 'Tutoring' },
    { slug: 'enrichment-programs',   icon: '🎨', label: 'Enrichment Programs' },
    { slug: 'educational-resources', icon: '📖', label: 'Educational Resources' },
    { slug: 'home-schooling',        icon: '🏡', label: 'Home Schooling' },
    { slug: 'iep-assistance',        icon: '📋', label: 'IEP Assistance' },
  ],
  'financial': [
    { slug: null,                               icon: '💰', label: 'All Financial' },
    { slug: 'estate-planning',                  icon: '📜', label: 'Estate Planning' },
    { slug: 'financial-advisors',               icon: '📈', label: 'Financial Advisors' },
    { slug: 'financial-planning',               icon: '💹', label: 'Financial Planning' },
    { slug: 'government-benefits-consultation', icon: '🏛️', label: 'Government Benefits' },
    { slug: 'grant-consultation-agencies',      icon: '🎁', label: 'Grant Consultation' },
    { slug: 'planning-consultation',            icon: '🗓️', label: 'Planning Consultation' },
  ],
  'job-and-vocational': [
    { slug: null,                           icon: '💼', label: 'All Job & Vocational' },
    { slug: 'career-counseling',            icon: '🗣️', label: 'Career Counseling' },
    { slug: 'employment',                   icon: '🤝', label: 'Employment' },
    { slug: 'job-coaching',                 icon: '🏆', label: 'Job Coaching' },
    { slug: 'vocational-training-programs', icon: '🔧', label: 'Vocational Training' },
  ],
  'legal': [
    { slug: null,                      icon: '⚖️', label: 'All Legal' },
    { slug: 'advocacy-groups',         icon: '📢', label: 'Advocacy Groups' },
    { slug: 'lawyers-and-law-offices', icon: '👨‍⚖️', label: 'Lawyers & Law Offices' },
    { slug: 'legal-aid',               icon: '🤝', label: 'Legal Aid' },
    { slug: 'legal-consultation',      icon: '💬', label: 'Legal Consultation' },
  ],
  'medical': [
    { slug: null,                  icon: '🏥', label: 'All Medical' },
    { slug: 'clinics',             icon: '🏥', label: 'Clinics' },
    { slug: 'hospitals',           icon: '🏨', label: 'Hospitals' },
    { slug: 'specialized-doctors', icon: '👨‍⚕️', label: 'Specialized Doctors' },
  ],
  'nutrition-and-dietary': [
    { slug: null,                       icon: '🥗', label: 'All Nutrition & Dietary' },
    { slug: 'dietitians',               icon: '🥦', label: 'Dietitians' },
    { slug: 'food-assistance-programs', icon: '🍱', label: 'Food Assistance' },
    { slug: 'meal-delivery',            icon: '🚚', label: 'Meal Delivery' },
    { slug: 'nutrition-counseling',     icon: '💬', label: 'Nutrition Counseling' },
  ],
  'recreational-activities': [
    { slug: null,                     icon: '🏕️', label: 'All Recreational Activities' },
    { slug: 'camps',                  icon: '🏕️', label: 'Camps' },
    { slug: 'art-programs',           icon: '🎨', label: 'Art Programs' },
    { slug: 'music-programs',         icon: '🎵', label: 'Music Programs' },
    { slug: 'recreation-programs',    icon: '🎭', label: 'Recreation Programs' },
    { slug: 'sports-leagues',         icon: '⚽', label: 'Sports Leagues' },
    { slug: 'therapeutic-recreation', icon: '🌿', label: 'Therapeutic Recreation' },
  ],
  'residential-care': [
    { slug: null,                         icon: '🏠', label: 'All Residential Care' },
    { slug: 'assisted-living-facilities', icon: '🏡', label: 'Assisted Living' },
    { slug: 'emergency-shelter',          icon: '🚨', label: 'Emergency Shelter' },
    { slug: 'group-homes',                icon: '🏘️', label: 'Group Homes' },
    { slug: 'housing-services',           icon: '🔑', label: 'Housing Services' },
    { slug: 'specialized-housing',        icon: '🏠', label: 'Specialized Housing' },
  ],
  'social': [
    { slug: null,                             icon: '🤝', label: 'All Social' },
    { slug: 'charities',                      icon: '❤️', label: 'Charities' },
    { slug: 'community-outreach',             icon: '📣', label: 'Community Outreach' },
    { slug: 'family-support',                 icon: '👨‍👩‍👧', label: 'Family Support' },
    { slug: 'government-assistance-programs', icon: '🏛️', label: 'Government Assistance' },
    { slug: 'nonprofit-organizations',        icon: '🌟', label: 'Nonprofits' },
  ],
  'therapeutic': [
    { slug: null,                   icon: '🧠', label: 'All Therapeutic' },
    { slug: 'alternative-therapy',  icon: '🌿', label: 'Alternative Therapy' },
    { slug: 'behavioral-therapy',   icon: '📊', label: 'Behavioral Therapy' },
    { slug: 'occupational-therapy', icon: '🤲', label: 'Occupational Therapy' },
    { slug: 'physical-therapy',     icon: '🦾', label: 'Physical Therapy' },
    { slug: 'speech-therapy',       icon: '🗣️', label: 'Speech Therapy' },
  ],
  'training-for-care-providers': [
    { slug: null,                     icon: '📋', label: 'All Training' },
    { slug: 'certification-programs', icon: '🎓', label: 'Certification Programs' },
    { slug: 'in-person-training',     icon: '👥', label: 'In-Person Training' },
    { slug: 'online-courses',         icon: '💻', label: 'Online Courses' },
    { slug: 'support-network',        icon: '🤝', label: 'Support Network' },
    { slug: 'workshops',              icon: '🔧', label: 'Workshops' },
  ],
  'transportation': [
    { slug: null,                      icon: '🚌', label: 'All Transportation' },
    { slug: 'public-transit',          icon: '🚇', label: 'Public Transit' },
    { slug: 'school-bus-services',     icon: '🚌', label: 'School Bus Services' },
    { slug: 'transportation-services', icon: '🚗', label: 'Transportation Services' },
  ],
};

// Active subcategories with live listings — expand as more go live
// Format: 'parent-slug/child-slug'
export const ACTIVE_SLUGS = new Set([
  'counseling/therapists',
  'recreational-activities/camps',
  'education/schools',
  'therapeutic/speech-therapy',
]);

// Derived: which parent categories have at least one active subcategory
export const ACTIVE_PARENT_SLUGS = new Set([...ACTIVE_SLUGS].map((s) => s.split('/')[0]));
