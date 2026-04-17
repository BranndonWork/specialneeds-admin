import TherapistsTemplate from './Templates/counseling/therapists';
import SchoolsTemplate from './Templates/education/schools';
import CampsTemplate from './Templates/recreational-activities/camps';
import SpeechTherapyTemplate from './Templates/therapeutic/speech-therapy';

// Map child category slugs to their template components.
// Add one entry per new child category template.
const TEMPLATES = {
  'counseling/therapists':          TherapistsTemplate,
  'education/schools':              SchoolsTemplate,
  'recreational-activities/camps':  CampsTemplate,
  'therapeutic/speech-therapy':     SpeechTherapyTemplate,
};

export const getTemplate = (categorySlug) => TEMPLATES[categorySlug] || null;
