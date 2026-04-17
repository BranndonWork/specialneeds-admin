import {useTranslations} from 'next-intl';

const Copyright = () => {
  const t = useTranslations('navigation.copyright');

  return (
    <div className="copyrights-area">
      <div className="row align-items-center">
        <div className="col-lg-6 col-sm-6 col-md-6">
          <p>
            {t('copyright')} <i className="bx bx-copyright"></i> <span>SpecialNeeds.com</span>{" "}
            {new Date().getFullYear()} {t('reserved')}.
          </p>
        </div>
        <div className="col-lg-6 col-sm-6 col-md-6 text-right">
          <p>Made with ❤️ by SpecialNeeds.com</p>
        </div>
      </div>
    </div>
  );
};

export default Copyright;
