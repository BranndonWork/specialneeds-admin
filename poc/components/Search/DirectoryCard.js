import config from "@config/config";
import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";

const DirectoryCard = ({ item }) => {
  const [cardWidth, setCardWidth] = useState(null);
  const router = useRouter();

  const handleCategoryClick = (category) => {
    let query = { ...router.query };
    delete query.search;

    // Check if category has a parent (sub-category case)
    if (category.parent && category.parent.slug) {
      // Extract just the child slug from the full path
      // e.g., "special-needs/autism-spectrum" -> "autism-spectrum"
      const childSlug = category.slug.includes('/')
        ? category.slug.split('/').pop()
        : category.slug;

      router.push({
        query: { ...query, category: category.parent.slug, sub_category: childSlug },
      });
    } else {
      // Top-level category
      router.push({
        query: { ...query, category: category.slug },
      });
    }
  };

  const getSlug = (item) => {
    return `/directory/${item.slug}/`;
  };

  useEffect(() => {
    if (typeof window == "undefined") return;

    updateCardWidth(cardWidth, setCardWidth);
    updateCardHeights();

    // Add the mutation observer to observe changes in the listings container
    const listingsContainer = document.querySelector(".listings-content");
    const observer = new MutationObserver(() => {
      updateCardHeights();
      updateCardWidth(cardWidth, setCardWidth);
    });
    observer.observe(listingsContainer, { childList: true, subtree: true });

    window.addEventListener("resize", updateCardHeights);

    return () => {
      window.removeEventListener("resize", updateCardHeights);
      // Disconnect the observer when the component is unmounted
      observer.disconnect();
    };
  }, [cardWidth]);

  const displayImages = () => {
    if (cardWidth === null) {
      return <div className="listings-image-placeholder" style={{ height: "200px" }}></div>;
    }

    let url, alt;
    if (!item.imageUrl) {
      url = `/images/missing-${item.category_slug}-image.jpg`;
      alt = "No Images Added";
    } else {
      // if the image url has assets in it, then it's already been resized
      if (item.imageUrl.includes("assets.specialneeds.com")) {
        url = serveAsset(item.imageUrl, cardWidth);
      }
      url = item.imageUrl;
      alt = item.title + " featured image";
    }

    return (
      <div className="listings-image">
        <Image src={url.replace(/^http:\/\//i, "https://")} alt={alt} className="single-image" width={400} height={300} />
        <div
          className="category-name"
          onClick={(e) => {
            e.preventDefault();
            handleCategoryClick(item.category);
          }}
        >
          {item.category && item.category.singular}
        </div>
        <style jsx>{`
          .category-name {
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Add a gray drop shadow effect */
            background-color: rgba(128, 128, 128, 0.5); /* gray with 50% opacity */
            z-index: 999999;
            display: block;
            position: absolute;
            color: white;
            font-weight: 600;
            bottom: 0px;
            width: 100%;
            text-align: center;
            padding: 2px 0;
            font-size: 14px;
            border-radius: 0 0 5px 5px;
          }
          .listings-image {
            position: relative;
          }
        `}</style>
      </div>
    );
  };

  const displayDescription = () => {
    if (item.content) {
      let text = Utils.stripHTML(item.content);
      let desc = text.substring(0, 175);
      if (desc.length < text.length) {
        desc = desc.substring(0, desc.lastIndexOf(" "));
        desc += "...";
      }

      return (
        <div
          className="listing-description card-content"
          style={{ color: "var(--blackColor)", fontWeight: "400", marginTop: "15px" }}
        >
          {desc}
        </div>
      );
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
          <style jsx>{`
            .content-author img {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              margin-right: 5px;
              margin-top: -3px;
              border: 1px solid #ccc;
            }
            .content-author i {
              margin-right: 5px;
              margin-top: -3px;
            }
            .content-author span {
              cursor: pointer;
              color: var(--mainColor);
              font-weight: 500;
            }
            .content-author span:hover {
              text-decoration: underline;
              font-weight: 600;
            }
          `}</style>
        </div>
      );
    }
  };

  return (
    <>
      <div className="col-xl-4 col-lg-6 col-md-6" key={item.id}>
        {item && (
          <div className="single-listings-box">
            <Link href={getSlug(item)}>
              {displayImages()}
              <div className="listings-content">
                {item.featured && (
                  <div className="supporter">
                    <div className="d-flex align-items-center">
                      <i
                        className="bx bxs-badge-check"
                        style={{ color: "#efc02e", marginRight: "2px" }}
                      ></i>

                      <span>Featured</span>
                    </div>
                  </div>
                )}
                {item.address && (
                  <ul className="listings-meta">
                    <li>
                      <i className="flaticon-pin"></i> {item.address.city},{" "}
                      {item.address.state_province}{" "}
                    </li>
                  </ul>
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
              </div>
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default DirectoryCard;

function updateCardHeights() {
  const cards = document.querySelectorAll(".listings-content");
  let tallest = 0;

  // Reset heights and find the tallest card
  cards.forEach((card) => {
    card.style.height = ""; // Remove height so it can be recalculated
    const cardHeight = card.offsetHeight;

    if (cardHeight > tallest) {
      tallest = cardHeight;
    }
  });

  // Set all cards to the height of the tallest card
  cards.forEach((card) => {
    card.style.height = tallest + "px";
  });
}

function updateCardWidth(cardWidth, setCardWidth) {
  if (cardWidth == null) {
    const box = document.querySelector(".single-listings-box");
    if (box) {
      const calculatedWidth = Math.round(box.clientWidth / 100) * 100;
      setCardWidth(calculatedWidth);
    }
  }
}
