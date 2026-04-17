import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { getImageStyle } from "./imageStyles";
import { useImageIndex } from "./useImageIndex";

export const usePauseTime = () => {
  const [isPaused, setIsPaused] = useState(false);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  return [isPaused, handleMouseEnter, handleMouseLeave];
};

const RotateImages = ({ slideshowTimeout, slideshowImages, isRandom = false }) => {
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  const [imageIndex, rotateImage] = useImageIndex(slideshowImages, isRandom);
  const [isPaused, handleMouseEnter, handleMouseLeave] = usePauseTime();
  const [elapsedDisplayTime, setElapsedDisplayTime] = useState(0);
  const intervalId = useRef(null);
  const [images, setImages] = useState([]);

  const rotateImages = useCallback(() => {
    setVisibleImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    rotateImage();
    setElapsedDisplayTime(0); // Reset display time for the new image
  }, [slideshowImages.length, rotateImage]);

  useEffect(() => {
    intervalId.current = setInterval(() => {
      if (!isPaused) {
        setElapsedDisplayTime((prevTime) => {
          const newTime = prevTime + 100;
          if (newTime >= slideshowTimeout) {
            rotateImages();
            return 0; // Reset time after rotating
          }
          return newTime;
        });
      }
    }, 100); // Check every 100 milliseconds

    return () => clearInterval(intervalId.current); // Cleanup on unmount
  }, [isPaused, visibleImageIndex, rotateImages, slideshowTimeout]);

  useEffect(() => {
    const newImages = slideshowImages.map((image) => ({
      ...image,
      href: `${image.href}${
        image.href.includes("?") ? "&" : "?"
      }utm_source=sidebar&utm_medium=rotating_image&utm_campaign=sidebar`,
    }));
    setImages(newImages);
  }, [slideshowImages]);

  return (
    <section
      id="rotate-images"
      className="widget"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {images.map((image, index) => (
        <Link
          key={index}
          href={`${slideshowImages[visibleImageIndex]?.href}`}
          target="_blank"
          style={getImageStyle(slideshowImages, index, visibleImageIndex)}
        >
          {slideshowImages[visibleImageIndex]?.caption && (
            <div className="caption">{slideshowImages[visibleImageIndex]?.caption}</div>
          )}
        </Link>
      ))}
    </section>
  );
};

export default RotateImages;
