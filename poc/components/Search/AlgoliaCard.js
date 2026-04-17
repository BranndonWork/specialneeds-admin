import config from "@config/config";
import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

const AlgoliaImage = ({ item }) => {
  const [cardWidth, setCardWidth] = useState(null);

  const url = item.thumbnail
    ? serveAsset(item.thumbnail, cardWidth)
    : serveAsset("missingFeaturedImage", 50);
  const alt = item.thumbnail ? `${item.title} featured image` : "No Images Added";

  return (
    <div className="listings-image">
      <Image src={url.replace(/^http:\/\//i, "https://")} alt={alt} className="single-image" width={256} height={146} />
      <div className="category-name">{item.category_name}</div>
    </div>
  );
};

const AlgoliaCardContent = ({ item }) => {
  const router = useRouter();

  const displayDescription = () => {
    if (item.content) {
      let text = Utils.stripHTML(item.content);
      let desc = text.substring(0, 100);
      if (desc.length < text.length) {
        desc = desc.substring(0, desc.lastIndexOf(" "));
        desc += "...";
      }

      return <div className="listing-description card-content">{desc}</div>;
    } else {
      return "";
    }
  };

  const displayAuthor = () => {
    if (item.author) {
      let defaultAvatar = serveAsset("missingAvatar", 50);
      let avatar = item?.author?.avatar ? item.author.avatar : null;
      if (!avatar || !avatar.includes("assets.specialneeds.com")) {
        avatar = defaultAvatar;
      }
      let query = { ...router.query, search: "@" + item.author.displayname };
      const authorUrl = `${new URLSearchParams(query).toString()}`;
      return (
        <div className="content-author">
          <Link href={`${window.location.pathname}?${authorUrl}`} className="author-link">
            <Image src={serveAsset(avatar, 30)} alt={item.author.displayname} width={30} height={30} />
            <span
              title="Search for more by this author"
              aria-label="Search for more by this author"
            >
              {item.author.displayname}
            </span>
          </Link>
        </div>
      );
    }
  };
  return (
    <div className="listings-content">
      {item.featured && (
        <div className="supporter">
          <div className="d-flex align-items-center">
            <i className="bx bxs-badge-check"></i>
            <span>Featured</span>
          </div>
        </div>
      )}

      <h3>{item.title}</h3>

      {displayAuthor()}

      {displayDescription()}

      {config.listingReviewsEnabled && item.reviews && item.reviews.length > 0 ? (
        <div className="d-flex align-items-center justify-content-between">
          <div className="rating">
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bxs-star"></i>
            <i className="bx bx-star"></i>
            <span className="count">(10)</span>
          </div>
        </div>
      ) : null}
      {item.state_province && (
        <ul className="listings-meta">
          <li>
            <i className="flaticon-pin"></i> {item.city ? item.city + ", " : null}
            {item.state_province}{" "}
          </li>
        </ul>
      )}
    </div>
  );
};

const AlgoliaCard = ({ item }) => {
  return (
    <>
      {item && (
        <div className="single-listings-box">
          <Link href={`/directory/${item.slug}/`}>
            <AlgoliaImage item={item} />
            <AlgoliaCardContent item={item} />
          </Link>
        </div>
      )}
    </>
  );
};

export default AlgoliaCard;
