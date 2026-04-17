import Utils from "@utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

const ShareButtons = ({ content, shareUrl, disabled, label, listWrapperInlineStyles }) => {
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  if (!Array.isArray(disabled)) disabled = [];
  if (!shareUrl && typeof window !== "undefined") shareUrl = window.location.href;
  if (!listWrapperInlineStyles) listWrapperInlineStyles = {};

  useEffect(() => {
    setContentTitle(
      content?.article_data?.title ||
        content?.listing_data?.title ||
        content?.event_data?.title ||
        content?.title ||
        ""
    );
  }, [content]);

  const copyToClipboard = (clipboardContent) => {
    // create a temporary element to copy the content
    const tempElement = document.createElement("textarea");
    tempElement.value = clipboardContent;
    tempElement.setAttribute("readonly", "");
    tempElement.style.position = "absolute";
    tempElement.style.left = "-9999px";
    document.body.appendChild(tempElement);
    tempElement.select();
    document.execCommand("copy");
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 4000);
  };

  function generateEmailLink() {
    const pageHref = `https://${shareUrl}`;
    const pageLink = `<a href="${pageHref}">${contentTitle}</a>`;
    const bodyText = `Take a look at this special needs content - ${pageLink}`;
    const subject = `${contentTitle} - SpecialNeeds.com`;
    const encodedBodyText = encodeURIComponent(bodyText);
    const encodedSubject = encodeURIComponent(subject);
    const href = `mailto:?subject=${encodedSubject}&body=${encodedBodyText}`;
    return href;
  }

  return (
    <div className="social-share">
      <ul className="social-link social" style={listWrapperInlineStyles}>
        {label && (
          <li>
            <span>{label}</span>
          </li>
        )}

        {!disabled.includes("facebook") && (
          <li>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
              className="d-block share-button facebook"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-facebook white"></i>
            </Link>
          </li>
        )}

        {!disabled.includes("twitter") && (
          <li>
            <Link
              href={`https://twitter.com/intent/tweet?text=Take a look at this special needs content: ${contentTitle}&url=${shareUrl}`}
              className="d-block share-button twitter"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-twitter white"></i>
            </Link>
          </li>
        )}

        {!disabled.includes("linkedin") && (
          <li>
            <Link
              href={`https://www.linkedin.com/shareArticle?mini=true&amp;url=${shareUrl}&amp;title=${contentTitle}`}
              className="d-block share-button linkedin"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-linkedin white"></i>
            </Link>
          </li>
        )}

        {!disabled.includes("reddit") && (
          <li>
            <Link
              href={`https://www.reddit.com/submit?url=${shareUrl}&amp;title=${contentTitle}`}
              className="d-block share-button reddit"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-reddit white"></i>
            </Link>
          </li>
        )}

        {!disabled.includes("instagram") && (
          <li>
            <Link
              href={`https://www.instagram.com/sharer/sharer.php?u=${shareUrl}`}
              className="d-block share-button instagram"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-instagram white"></i>
            </Link>
          </li>
        )}

        {!disabled.includes("whatsapp") && (
          <li>
            <Link
              href={`https://wa.me/?text=Take a look at this special needs content: ${contentTitle} at ${shareUrl}`}
              className="d-block share-button whatsapp"
              target="_blank"
              rel="noreferrer"
            >
              <i className="bx bxl-whatsapp white"></i>
            </Link>
          </li>
        )}
        {!disabled.includes("link") && (
          <li>
            <a
              onClick={(e) => {
                e.preventDefault();
                copyToClipboard(shareUrl);
              }}
              className="d-block share-button"
              style={{ cursor: "pointer" }}
              id="shareLinkClick"
            >
              <i className="bx bx-link"></i>
            </a>
            <Tooltip
              color="white"
              anchorId="shareLinkClick"
              isOpen={showCopiedTooltip}
              content="Share link copied to clipboard!"
            />
          </li>
        )}
        {!disabled.includes("email") && (
          <li>
            <div
              dangerouslySetInnerHTML={{
                __html: Utils.displayWebLink(
                  generateEmailLink(),
                  '<i class="bx bx-envelope white"></i>'
                ),
              }}
            />
          </li>
        )}
      </ul>
    </div>
  );
};


export default ShareButtons;
