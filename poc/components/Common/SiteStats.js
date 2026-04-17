"use client";

import {useTranslations} from 'next-intl';
import React, { useState } from "react";

const SiteStats = () => {
  const tCommon = useTranslations('common');
  const tSiteStats = useTranslations('siteStats');
  const [monthlyVisitors, setMonthlyVisitors] = useState(0);
  const [listings, setListings] = useState(0);
  const [articles, setArticles] = useState(0);

  const animateChange = async (oldValue, newValue, setter) => {
    if (oldValue === newValue) {
      return;
    }

    if (typeof newValue !== "number") {
      setter(newValue);
      return;
    }

    const totalTime = 1000;
    const startTime = performance.now();
    let current = oldValue;

    function animate(time) {
      let timeFraction = (time - startTime) / totalTime;
      if (timeFraction > 1) timeFraction = 1;

      let progress = timeFraction;
      let result = Math.floor(oldValue + (newValue - oldValue) * progress);

      if (result !== current) {
        current = result;
        setter(current.toLocaleString());
      }

      if (timeFraction < 1) {
        requestAnimationFrame(animate);
      } else {
        setter(newValue.toLocaleString());
      }
    }

    requestAnimationFrame(animate);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: "60px" }}>
      <div className="col-lg-4 col-md-4 col-sm-4 col-6">
        <div className="single-funfacts text-center">
          <div className="icon-content-wrapper">
            <i className="bx bx-group"></i>
            <div>
              <p>{tSiteStats('monthlyVisitors')}</p>
              <h3>{monthlyVisitors}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-4 col-sm-4 col-6">
        <div className="single-funfacts text-center">
          <div className="icon-content-wrapper">
            <i className="bx bx-list-check"></i>
            <div>
              <p>{tCommon('terms.listings')}</p>
              <h3>{listings}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="col-lg-4 col-md-4 col-sm-4 col-6">
        <div className="single-funfacts text-center">
          <div className="icon-content-wrapper">
            <i className="bx bx-news"></i>
            <div>
              <p>{tCommon('terms.articles')}</p>
              <h3>{articles}</h3>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .icon-content-wrapper {
          position: relative;
          display: inline-flex;
          align-items: center;
        }

        .single-funfacts i {
          margin-right: 10px;
          margin-top: 40px;
          position: initial;
        }
      `}</style>
    </div>
  );
};


export default SiteStats;
