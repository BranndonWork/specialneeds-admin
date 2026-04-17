import lightGallery from "lightgallery";
import React, { useEffect } from "react";
import { smallImageStyles, styles } from "./LightGalleryStyles";

let combinedStyles = `${smallImageStyles}
${styles}`;

const Gallery = ({ content, options }) => {
  // All hooks must be called before any conditional returns
  useEffect(() => {
    // Guard clause inside the effect instead of before hooks
    if (!content || !content.images || !content.images.length) return;
    const lgContainer = document.getElementById("inline-gallery-container");

    const dynamicEl = content.images.map((image) => ({
      src: image.url,
      thumb: image.url,
      subHtml: `<div class="lightGallery-captions"><h4>${image.alt || "No Caption"}</h4></div>`,
      alt: image.alt || "No Caption",
    }));

    const inlineGallery = lightGallery(lgContainer, {
      onAfterSlide: (one, two, three, four) => {
        console.log("LightGallery Image displayed on screen:", { one, two, three, four });
      },
      container: lgContainer,
      dynamic: true,
      hash: false,
      closable: false,
      download: false,
      loop: true,
      showMaximizeIcon: true,
      appendSubHtmlTo: ".lg-sub-html",
      slideDelay: 400,
      dynamicEl,
    });

    inlineGallery.openGallery();

    const handleKeyPress = (event) => {
      const isFullScreen = document.querySelector(
        ".lg-container.lg-show.lg-show-in:not(.lg-inline)"
      );
      if (event.key === "Escape" && isFullScreen) {
        const maximizeButton = document.querySelector(".lg-maximize.lg-icon");
        if (maximizeButton) {
          maximizeButton.click();
        }
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      inlineGallery.destroy();
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [content]);

  // Early return for render after all hooks are called
  if (!content || !content.images || !content.images.length) return null;

  return (
    <>
      <div
        id="inline-gallery-container"
        className="inline-gallery-container"
        style={{ width: "100%", height: "0", paddingBottom: "73%" }}
      ></div>
      <hr style={{ marginBottom: "18px" }} />
      <style jsx global>
        {combinedStyles}
      </style>
    </>
  );
};

export default Gallery;
