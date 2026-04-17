"use client";

import {useTranslations} from 'next-intl';

const LanguageSwitch = ({}) => {
  const t = useTranslations('footer.languages');
  const selectOptions = t.raw('selectOptions');

  const handleLanguageChange = (e) => {
    // Future: implement language switching
  };
  return (
    <div className="col-lg-3 col-sm-6 col-md-6">
      <div className="single-footer-widget">
        <h3>{t('heading')}</h3>
        <div className="languages-switch">
          <select onChange={handleLanguageChange}>
            {selectOptions.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
export default LanguageSwitch;
