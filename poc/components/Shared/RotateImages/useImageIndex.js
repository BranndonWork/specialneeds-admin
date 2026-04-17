import { useState } from "react";

export const useImageIndex = (slideshowImages, isRandom) => {
  const [imageIndex, setImageIndex] = useState(0);

  const rotateImage = () => {
    if (isRandom) {
      setImageIndex(Math.floor(Math.random() * slideshowImages.length));
    } else {
      setImageIndex((prevIndex) => (prevIndex + 1) % slideshowImages.length);
    }
  };

  return [imageIndex, rotateImage];
};
