import Link from "next/link";
import { Tooltip } from "react-tooltip";
import Utils from "../index";

const getTooltip = (content, anchorText, icon) => {
  const id = Utils.contentHash(Math.random());
  return (
    <>
      <Tooltip anchorId={id} />
      <a id={id} data-tooltip-html={Utils.splitLinesAfter(content, 42)}>
        {anchorText && (
          <strong>
            <span className="dotted">{anchorText}</span>
          </strong>
        )}
        {icon && <i className={icon}></i>}
      </a>
    </>
  );
};

class ListingUtils {
  constructor() {}

  displayRow(row) {
    let value = row?.attributes?.value || row?.attributes?.fields || null;
    let label = row?.label;
    let tooltip = row?.description;
    const colWidth = "col-4";
    const originalLabel = label;
    if (tooltip) {
      label = getTooltip(tooltip, label);
    }

    const displayBooleanField = (value, label) => {
      return (
        <tr>
          <td className={colWidth}>
            <strong>{label}:</strong>
          </td>
          <td>{value ? "Yes" : "No"}</td>
        </tr>
      );
    };

    const displayRepeaterField = (repeaterRows, label) => {
      const nonWrappingStyle = {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        verticalAlign: "top",
      };
      return (
        <tr>
          <td className="col-4">
            <strong>{label}:</strong>
          </td>
          <td>
            {repeaterRows.map((individualRow, idx) => (
              <table key={idx} className={idx > 0 ? "mt-3" : ""}>
                <tbody>
                  {Object.keys(row.attributes.fields).map((key, idx2) => (
                    <tr key={idx2}>
                      <td style={nonWrappingStyle} className="col-4">
                        <strong>
                          {getTooltip(
                            row.attributes.fields[key].description,
                            row.attributes.fields[key].label
                          )}
                          :
                        </strong>
                      </td>
                      <td className="col-8">{individualRow[key]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          </td>
        </tr>
      );
    };

    const displayArrayField = (value, label) => {
      return (
        <tr>
          <td className={colWidth}>
            <strong>{label}:</strong>
          </td>
          <td>{value.join(", ")}</td>
        </tr>
      );
    };

    if (typeof value === "boolean") {
      return displayBooleanField(value, label);
    }

    if (Array.isArray(value)) {
      if (value.length === 0) return null;
      // if the type of the first item in the array is an object, it's a repeater field
      if (typeof value[0] === "object") {
        return displayRepeaterField(value, label);
      }
      return displayArrayField(value, label);
    }

    if (Utils.isValidUrl(value)) {
      let url = `<a href="${value}" target="_blank">${value}</a>`;
      return (
        <tr>
          <td className={colWidth}>
            <strong>{label}:</strong>
          </td>
          <td>
            <div dangerouslySetInnerHTML={{ __html: url }} />
          </td>
        </tr>
      );
    }

    if (value) {
      // if label starts with "Percent", add a % sign to the end of the value
      if (originalLabel.match(/^Percent/)) {
        value = String(value) + "%";
      }
      return (
        <tr>
          <td className={colWidth}>
            <strong>{label}:</strong>
          </td>
          <td>{value}</td>
        </tr>
      );
    }

    return null;
  }

  getContactWidgetContent(content) {
    const listingData = content.listing_data;
    const contactDetails = {
      title: "Contact Details",
      content: [],
    };

    if (listingData) {
      if (listingData.website) {
        contactDetails.content.push(
          <>
            <i className="bx bx-globe"></i>
            <Link href={listingData.website}>
              <a href={listingData.website} target="_blank" rel="noreferrer">
                {listingData.website.split("://")[1]}
              </a>
            </Link>
          </>
        );
      }
      if (listingData.email) {
        contactDetails.content.push(
          <>
            <i className="bx bx-envelope"></i>
            <a href={`mailto:${listingData.email}`}>{listingData.email}</a>
          </>
        );
      }
      if (listingData.phone) {
        contactDetails.content.push(
          <>
            <i className="bx bx-phone-call"></i>
            <Link href={`tel:${listingData.phone}`}>
              <a>{Utils.displayPhoneNumber(listingData)}</a>
            </Link>
          </>
        );
      }
      if (listingData.address.state_province && listingData.address.city) {
        contactDetails.content.push(
          <>
            <i className="bx bx-map"></i>
            <Link
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                Utils.displayAddress(listingData)
              }
            >
              <a target="_blank">
                <div
                  dangerouslySetInnerHTML={{
                    __html: Utils.displayAddress(listingData, false),
                  }}
                ></div>
              </a>
            </Link>
          </>
        );
      }
    }
    if (contactDetails.content.length > 0) {
      return contactDetails;
    }
    return null;
  }

  getSocialMediaWidgetContent(content) {
    const listingData = content.listing_data;
    const socialLinks = {
      title: "Social Links",
      content: [],
    };
    if (listingData?.facebook) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-facebook"></i>
          <a href={listingData?.facebook} target="_blank" rel="noreferrer">
            Visit on Facebook
          </a>
        </>
      );
    }
    if (listingData?.twitter) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-twitter"></i>
          <a href={listingData?.twitter} target="_blank" rel="noreferrer">
            Visit on Twitter
          </a>
        </>
      );
    }
    if (listingData?.instagram) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-instagram"></i>
          <a href={listingData?.instagram} target="_blank" rel="noreferrer">
            Visit on Instagram
          </a>
        </>
      );
    }
    if (listingData?.youtube) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-youtube"></i>
          <a href={listingData?.youtube} target="_blank" rel="noreferrer">
            Visit on YouTube
          </a>
        </>
      );
    }
    if (listingData?.whatsapp) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-whatsapp"></i>
          <a href={`https://wa.me/${listingData?.whatsapp}`} target="_blank" rel="noreferrer">
            Visit on WhatsApp
          </a>
        </>
      );
    }
    if (listingData?.pinterest) {
      socialLinks.content.push(
        <>
          <i className="bx bxl-pinterest"></i>
          <a href={listingData?.pinterest} target="_blank" rel="noreferrer">
            Visit on Pinterest
          </a>
        </>
      );
    }
    if (socialLinks.content.length > 0) {
      return socialLinks;
    }
    return null;
  }

  showNoTableDataMessage(wrapperClass) {
    const tables = document.querySelectorAll(wrapperClass || "table");
    tables.forEach((table) => {
      if (table.querySelectorAll("tr").length === 0) {
        const message = document.createElement("div");
        message.classList.add("no-data-message");
        message.classList.add("mb-4");
        // add a style to the message
        message.style.marginTop = "-5px";
        message.style.fontWeight = "600";
        message.style.fontStyle = "italic";
        message.innerHTML = "No data to display";
        table.parentNode.replaceChild(message, table);
      }
    });
  }
}

export default new ListingUtils();
