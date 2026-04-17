import constants from "@data/texts/en/constants.json";
import searchUtils from "@data/texts/en/searchUtils.json";
import Utils from "@utils";
import { serveAsset } from "@utils/assetHelpers";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";

const useSearchUtils = () => {
  const router = useRouter();

  const _getUpdatedBrowserUrl = (key, value, deleteParams = []) => {
    if (!Array.isArray(deleteParams)) deleteParams = [];
    if (typeof deleteParams === "string") deleteParams = [deleteParams];
    if (!value) deleteParams.push(key);

    let query = { ...router.query };
    if (value) {
      query[key] = value;
    } else {
      deleteParams.push(key);
    }
    if (deleteParams) {
      deleteParams.forEach((param) => {
        delete query[param];
      });
    }
    if (Object.keys(query).length === 0) return window.location.pathname;
    return window.location.pathname + `?${new URLSearchParams(query).toString()}`;
  };

  const displayImage = (item, contentType) => {
    try {
      let url, alt;
      if (!item.images || item.images.length === 0) {
        if (contentType === "listings") {
          url = `/images/missing-${item.category.slug}-image.jpg`;
          alt = searchUtils.noImage;
        } else {
          url = `/images/missing-${contentType}-image.jpg`;
          alt = item.title + " " + searchUtils.featuredImage;
        }
        item.images = [{ url: url, alt: alt }];
      }
      url = serveAsset(item.images[0].url, 50);
      alt = item.images[0].alt ? item.images[0].alt : item.title + " " + searchUtils.featuredImage;
      return (
        <Link href={`/${item.slug}/`}>
          <div style={{ width: "50px", height: "30px", overflow: "hidden" }}>
            <Image
              src={url.replace(/^http:\/\//i, "https://")}
              alt={alt}
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
              width={50}
              height={30}
            />
          </div>
        </Link>
      );
    } catch (error) {
      return "";
    }
  };

  const displayTitle = (item) => {
    try {
      return (
        <Link
          href={`${router.pathname}/${item.slug}/`}
          style={{ color: "var(--bs-link-color)", textDecoration: "none", fontWeight: "bold" }}
        >
          {item.title}
        </Link>
      );
    } catch (error) {
      return "";
    }
  };

  const displayCategory = (item) => {
    try {
      const url = _getUpdatedBrowserUrl("category", item.category.slug, ["search", "location"]);
      return (
        <Link
          href={url}
          onClick={(e) => {
            e.preventDefault();
            router.push(url);
          }}
        >
          {item.category.name}
        </Link>
      );
    } catch (error) {
      return "";
    }
  };

  const displaySearchUser = (searchUser) => {
    try {
      if (!searchUser) return "";
      const url = _getUpdatedBrowserUrl("search", searchUser, ["category", "location"]);

      return (
        <Link
          href={url}
          onClick={(e) => {
            e.preventDefault();
            router.push(url);
          }}
        >
          {searchUser}
        </Link>
      );
    } catch (error) {
      return "";
    }
  };

  const displayDate = (itemDate, format = "MMMM DD, YYYY") => {
    if (!itemDate) return "";
    try {
      return moment(itemDate).format(format);
    } catch (error) {
      return "";
    }
  };

  const updateLocationMessage = (newText) => {
    // hide show-distance-link
    document.querySelectorAll(".show-distance-link").forEach((el) => {
      el.style.display = "none";
    });
    document.querySelectorAll(".show-distance-link-text").forEach((el) => {
      el.textContent = newText;
    });
  };

  const displayDistance = (item) => {
    if (item?.distance) {
      let miles = item.distance;
      miles = miles.toFixed(0);
      if (miles > 999) {
        miles = miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
      return miles + " " + searchUtils.milesAway;
    }
    return null;
  };

  const displayLocation = (item) => {
    try {
      if (!item.address) return constants.none;
      const url = _getUpdatedBrowserUrl(
        "location",
        item.address.city + ", " + item.address.state_province,
        ["page"]
      );

      // const distanceInfo = displayDistance(item);
      const distanceInfo = "";
      const location =
        `${item.address.city}, ${item.address.state_province}`
          .replace(/(^,\s)|(\s,$)/g, "")
          .trim() || "";
      if (!location) {
        return (
          <div
            dangerouslySetInnerHTML={{
              __html: "<span class='text-muted'>Location Unavailable</span>",
            }}
          />
        );
      }

      return (
        <>
          <Link
            href={url}
            onClick={(e) => {
              e.preventDefault();
              router.push(url);
            }}
          >
            {item.address.city}, {item.address.state_province}
          </Link>

          {distanceInfo ? (
            <>
              <span> - </span> {distanceInfo}
            </>
          ) : (
            ""
          )}
        </>
      );
    } catch (error) {
      return "";
    }
  };

  const getTableData = (contentList, contentType = "listings") => {
    let header = [
      { label: constants.image, sxStyle: { width: "50px" } },
      { label: constants.title, sxStyle: { width: "100%" } },
      { label: constants.category },
      { label: constants.location },
    ];
    if (contentType == "article") {
      header.pop();
    }

    if (contentList.length === 0) {
      return {
        header,
        data: [],
      };
    }

    let data = contentList.map((item) => {
      let row = [
        {
          content: displayImage(item, contentType == "listing" ? item.category.slug : contentType),
          sxStyle: { padding: "5px 5px 5px 10px" },
        },
        {
          content: displayTitle(item),
        },
        {
          content: displayCategory(item),
          sxStyle: { whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" },
        },
        {
          content: displayLocation(item),
          sxStyle: { whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" },
        },
      ];
      if (contentType == "article") {
        row.pop();
      }
      return row;
    });

    return {
      header,
      data,
    };
  };

  return {
    displayImage,
    displayTitle,
    displayCategory,
    displaySearchUser,
    displayDate,
    displayLocation,
    updateLocationMessage,
    getTableData,
  };
};

export default useSearchUtils;
