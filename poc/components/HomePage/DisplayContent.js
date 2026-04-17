"use client";

import {useTranslations} from 'next-intl';
import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import { useEffect, useCallback } from "react";

const bootstrapClasses = [
  "col-lg-8 col-sm-12 col-md-12",
  "col-lg-4 col-sm-12 col-md-12",
  "col-lg-3 col-sm-6 col-md-6",
  "col-lg-3 col-sm-6 col-md-6",
  "col-lg-6 col-sm-12 col-md-12",
];

const getFeaturedImage = (item, index, contentType) => {
  if (item.thumbnail) {
    let maxWidth =
      parseInt(bootstrapClasses[index % bootstrapClasses.length].split(" ")[0].split("-")[2]) * 100;
    return serveAsset(item.thumbnail, maxWidth);
  }

  if (item.images && item.images.length > 0) {
    return item.images[0].url;
  }

  let type = contentType === "article" ? "articles" : "listings";

  if (type === "listings") {
    let categorySlug = item.slug.split("/")[1];
    return `/assets/core/missing-${categorySlug}-image.jpg`;
  }

  return `/assets/core/missing-${type}-image.jpg`;
};

const displayAddress = (address) => {
  let city = address.city ? address.city + ", " : "";
  let state = address.state_province ? address.state_province : "";
  if (city === "" && state === "") return null;
  return (
    <>
      <br />
      <span className="address">
        <i className="flaticon-pin"></i> {city}
        {state}
      </span>
    </>
  );
};

const DisplayContentGrid = ({ content, contentType }) => {
  const tHeadings = useTranslations('headings');
  const tDescriptions = useTranslations('descriptions');
  const uniqueHash = Utils.contentHash(content);

  const checkImage = (url, onSuccess, onError) => {
    const img = new Image();
    img.onload = onSuccess;
    img.onerror = onError;
    img.src = url;
  };

  const workingImages = {};
  const nonWorkingImages = {};

  const DisplayItem = ({ item, index, contentType }) => {
    const identifier = `${contentType}-${index}-${uniqueHash}`;
    const itemData = item[contentType + "_data"] || item;
    const slugPrefix = contentType === "article" ? "articles" : "directory";
    const defaultImage =
      item && item.thumbnail ? item.thumbnail : serveAsset("missingFeaturedImage");
    const setBackgroundImage = useCallback(() => {
      const imageUrl = getFeaturedImage(itemData, index, contentType);
      const updatedUrl = serveAsset(imageUrl, 800);
      const backgroundElement = document.getElementById(`background-${identifier}`);
      const backgroundImages = [updatedUrl];

      let categorySlug = item.slug.split("/")[0];
      backgroundImages.push(`/assets/core/missing-${categorySlug}-image.jpg`);

      let subCategorySlug = item.slug.split("/")[1];
      backgroundImages.push(`/assets/core/missing-${subCategorySlug}-image.jpg`);
      backgroundImages.push(`/assets/core/missing-${contentType}s-image.jpg`);
      backgroundImages.push(`/assets/core/missing-${contentType}-image.jpg`);
      backgroundImages.push(serveAsset("missingFeaturedImage"));

      const trySetBackgroundImage = (urls, index = 0) => {
        if (index >= urls.length) return;
        if (workingImages[urls[index]]) {
          backgroundElement.style.backgroundImage = `url(${workingImages[urls[index]]})`;
          return;
        }
        if (nonWorkingImages[urls[index]]) {
          trySetBackgroundImage(urls, index + 1);
          return;
        }
        let url = urls[index];

        const img = new Image();
        img.onload = () => {
          let finalUrl = url;
          if (url.startsWith("/assets/")) {
            const width = Math.ceil(backgroundElement.clientWidth / 100) * 100;
            const height = Math.ceil(backgroundElement.clientHeight / 100) * 100;
            const urlInstance = new URL(url, location.origin);
            const updatedParams = new URLSearchParams(urlInstance.search);
            updatedParams.set("width", width);
            updatedParams.set("height", height);
            // updatedParams.set("func", "bound");
            updatedParams.set("gravity", "smart");
            urlInstance.search = updatedParams.toString();
            finalUrl = urlInstance.toString();
          }
          backgroundElement.style.backgroundImage = `url(${finalUrl})`;
          workingImages[url] = finalUrl;
        };
        img.onerror = () => {
          trySetBackgroundImage(urls, index + 1);
        };
        img.src = url;
      };

      trySetBackgroundImage(backgroundImages);
    }, [item, itemData, index, contentType, identifier]);

    useEffect(() => {
      setBackgroundImage();
    }, [item, setBackgroundImage]);

    return (
      <div className={bootstrapClasses[index % bootstrapClasses.length]} key={index}>
        <div className="single-destinations-box color-box-shadow">
          <div
            id={`background-${identifier}`}
            style={{
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundImage: `url(${defaultImage})`,
              height: "300px",
              width: "100%",
            }}
            alt={itemData.title + " featured image"}
          ></div>
          <div className="content">
            <h3>{itemData.category_name}</h3>
            <span>{itemData.title}</span>
            {displayAddress(itemData)}
          </div>
          <Link href={`/${slugPrefix}/${itemData.slug}`} className="link-btn"></Link>
        </div>
      </div>
    );
  };

  return (
    <div className="row">
      {content.map((item, index) => (
        <DisplayItem item={item} index={index} key={index} contentType={contentType} />
      ))}
    </div>
  );
};

const DisplayContent = ({ content, contentType }) => {
  const tHeadings = useTranslations('headings');
  const tDescriptions = useTranslations('descriptions');

  if (!content || !Array.isArray(content)) return null;

  if (contentType === "listing") {
    if (content.length === 0) return null;
    return (
      <>
        <section className={`destinations-area pt-100`}>
          <div className="container">
            <div className="section-title">
              <h2>{tHeadings('popularListings')}</h2>
              <p>{tDescriptions('popularListings')}</p>
            </div>
            <DisplayContentGrid content={content} contentType={contentType} />
          </div>
        </section>
      </>
    );
  } else if (contentType === "recentByCategory") {
    if (!Array.isArray(content) || content.length === 0) return null;
    return (
      <section className="destinations-area pt-100">
        <div className="container">
          <div className="section-title">
            <h2>{tHeadings('recentListings')}</h2>
          </div>
          {content.map((group) => {
            if (!group.listings || group.listings.length === 0) return null;
            const subCategory = group.listings[0]?.slug?.split('/')[1];
            const seeAllUrl = subCategory
              ? `/directory/?category=${group.categorySlug}&sub_category=${subCategory}`
              : `/directory/?category=${group.categorySlug}`;
            return (
              <div key={group.categorySlug} className="mb-5">
                <h3>{group.categoryName}</h3>
                <DisplayContentGrid content={group.listings} contentType="listing" />
                <div className="text-center mt-4">
                  <Link href={seeAllUrl} className="default-btn">
                    See All {group.categoryName}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  } else if (contentType === "news") {
    if (!content || !Array.isArray(content)) return null;
    if (content.length === 0) return null;

    return (
      <>
        <section className={`destinations-area pt-100`}>
          <div className="container">
            <div className="section-title">
              <h2>{tDescriptions('recentNews.title')}</h2>
              <p>{tDescriptions('recentNews.description')}</p>
            </div>
            <DisplayContentGrid content={content} contentType="article" />
          </div>
        </section>
      </>
    );
  }
};


export default DisplayContent;
