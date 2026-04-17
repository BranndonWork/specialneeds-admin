import {useTranslations} from 'next-intl';
import React from "react";

const HowItWorks = ({ bgColor }) => {
  const t = useTranslations('howItWorks');
  const steps = t.raw('steps');

  return (
    <>
      <section className={`how-it-works-area pt-100 pb-70 ${bgColor}`}>
        <div className="container">
          <div className="section-title">
            <h2>{t('title')}</h2>
            <p>{t('description')}</p>
          </div>

          <div className="row justify-content-center">
            {steps.map((step, index) => (
              <div key={index} className="col-lg-4 col-md-6 col-sm-6">
                <div className="single-how-it-works-box">
                  <div className="icon">
                    <i className={step.icon}></i>
                  </div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
