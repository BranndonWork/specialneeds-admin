import Link from "next/link";
import React from "react";

const PageBanner = ({ bannerFilename, pageTitle, breadcrumbs }) => {
  if (typeof breadcrumbs === "undefined") breadcrumbs = [];
  if (typeof breadcrumbs === "string") breadcrumbs = [{ title: breadcrumbs }];

  let bannerStyle = {};
  if (typeof bannerFilename === "string" && bannerFilename !== "") {
    const cleanedFilename = bannerFilename.replace(/[^a-zA-Z0-9\s]/g, "");
    const cfId = `banner-${cleanedFilename.toLowerCase().replace(/\s+/g, "-")}`;
    const sectionBackground = `https://imagedelivery.net/iQbJNjrNARW2nbQ489hjzg/${cfId}/public`;
    bannerStyle = { backgroundImage: `url(${sectionBackground})` };
  }

  return (
    <>
      <div className="page-title-area page-title-bg2" style={bannerStyle}>
        <div className="container">
          <div className="page-title-content">
            <h2>
              {pageTitle.includes("</a>") ? (
                <div dangerouslySetInnerHTML={{ __html: pageTitle }} className="title-link" />
              ) : (
                pageTitle
              )}
            </h2>
            {breadcrumbs.length > 0 ? (
              <ul>
                <li>
                  <Link href="/">
                    Home
                  </Link>
                </li>
                {breadcrumbs.map((item, index) => {
                  return (
                    <li key={index}>
                      {item.url ? (
                        <Link href={item.url}>
                          {item.title}
                        </Link>
                      ) : (
                        <span>{item.title}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <ul>
                <li></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


export default PageBanner;
