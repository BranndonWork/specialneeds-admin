export const getImageStyle = (slideshowImages, index, visibleImageIndex) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundImage: `url(${slideshowImages[index]?.src})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  opacity: index === visibleImageIndex ? 1 : 0,
  transition: "opacity 0.33s ease-in-out",
});
