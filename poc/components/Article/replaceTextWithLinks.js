const searchTerms = [
  // { phrase: "cochlear implant", link: "/articles/?q=cochlear%20implant" },
];

const phrases = [
  { phrase: "Americans with Disabilities Act (ADA)", link: "https://www.ada.gov/" },
  { phrase: "Autism Spectrum Disorder (ASD)", link: "https://www.autismspeaks.org/" },
  { phrase: "Attention Deficit Hyperactivity Disorder (ADHD)", link: "https://www.chadd.org/" },
  { phrase: "Down Syndrome", link: "https://www.ndss.org/" },
  { phrase: "Special Education", link: "https://www.specialeducationguide.com/" },
  {
    phrase: "Individualized Education Program (IEP)",
    link: "https://www.understood.org/en/school-learning/special-services/ieps",
  },
  { phrase: "Dyslexia", link: "https://dyslexiaida.org/" },
  { phrase: "Cerebral Palsy", link: "https://www.cerebralpalsy.org/" },
  {
    phrase: "Speech and Language Disorders",
    link: "https://www.asha.org/public/speech/disorders/",
  },
  { phrase: "Occupational Therapy (OT)", link: "https://www.aota.org/" },
  { phrase: "Physical Therapy (PT)", link: "https://www.apta.org/" },
  { phrase: "Learning Disabilities", link: "https://ldaamerica.org/" },
  { phrase: "Intellectual Disabilities", link: "https://www.thearc.org/" },
  { phrase: "Assistive Technology", link: "https://www.atia.org/" },
  { phrase: "Sensory Processing Disorder (SPD)", link: "https://www.spdstar.org/" },
  {
    phrase: "Early Intervention Services",
    link: "https://www.ectacenter.org/topics/earlyid/earlyid.asp",
  },
  { phrase: "Social Security Disability Benefits", link: "https://www.ssa.gov/disability/" },
  { phrase: "Special Needs Trusts", link: "https://www.specialneedsalliance.org/" },
  { phrase: "Inclusive Education", link: "https://www.includenyc.org/" },
  { phrase: "Mental Health Services", link: "https://www.nami.org/Home" },
  ...searchTerms,
];

const replaceTextWithLinks = (content) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(content, "text/html");
  const paragraphs = doc.querySelectorAll("p");
  const replaced = phrases.map(() => false);

  paragraphs.forEach((p) => {
    let pContent = p.innerHTML;

    for (let i = 0; i < phrases.length; i++) {
      if (replaced[i]) continue;

      const phraseObj = phrases[i];
      const index = pContent.toLowerCase().indexOf(phraseObj.phrase.toLowerCase());
      const notInLink = pContent.slice(Math.max(0, index - 2), index) !== '="';

      if (index !== -1 && notInLink) {
        const link = `<a href="${phraseObj.link}" target="_blank">${phraseObj.phrase}</a>`;
        pContent =
          pContent.slice(0, index) + link + pContent.slice(index + phraseObj.phrase.length);

        replaced[i] = true;
      }
    }

    p.innerHTML = pContent;
  });

  return doc.body.innerHTML;
};

export default replaceTextWithLinks;
