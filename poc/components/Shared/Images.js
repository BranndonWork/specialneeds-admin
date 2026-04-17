import { EffectFade, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";

export const DisplayImages = ({ content, options }) => {
  if (!content) return null;
  const defaultOptions = {
    displayDefaultImage: true,
    displayImages: true,
  };

  if (options) {
    options = { ...defaultOptions, ...options };
  } else {
    options = defaultOptions;
  }

  let images = content.images;

  {
    /* if there are no images images */
  }
  if (images.length === 0 && options.displayDefaultImage) {
    images = [
      {
        url: "/assets/core/default-listing-image.jpg?width=600",
        alt: "Default Listing Image",
      },
    ];
  }

  {
    /* If there is a images and it has only one image */
  }
  if (images.length === 1) {
    // if there is only one image and it starts with '/images/' and we don't want to display the default image
    if (images[0].url.startsWith("/assets/") && !options.displayDefaultImage) {
      return <div className="single-image"></div>;
    }

    return (
      <div className="listings-image">
        <Image
          src={images[0].url.replace(/^http:\/\//i, "https://")}
          alt={images[0].alt}
          className="single-image"
          width={600}
          height={400}
        />
      </div>
    );
  }

  {
    /* If there is a images and it has more than one image */
  }
  if (images.length > 1) {
    return (
      <div className="listings-images">
        <Swiper
          loop={true}
          navigation={true}
          modules={[EffectFade, Navigation]}
          className="listings-image-slides"
          speed={2000}
          effect={"fade"}
          settings={{
            fadeEffect: { crossFade: true },
          }}
        >
          {images.length > 0 &&
            images.map((gal, i) => (
              <SwiperSlide key={i}>
                <div className="single-image">
                  <Image src={gal.url.replace(/^http:\/\//i, "https://")} alt={gal.alt} width={600} height={400} />
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    );
  }
};

export default DisplayImages;
