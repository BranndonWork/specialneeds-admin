import Image from "next/image";

const FeaturedImage = ({ article }) => {
  if (!article?.article_data?.images?.length) return null;
  const { url, alt } = article?.article_data?.images[0];
  if (!url) return null;
  const imageUrl = url.startsWith("/assets/") ? url + "?width=700&height=400&func=bound" : url;
  return (
    <div className="article-image" style={{ position: "relative", width: "100%", height: "500px" }}>
      <Image
        src={imageUrl}
        alt={alt || article?.article_data?.title + " Featured Image"}
        fill
        style={{ objectFit: "contain" }}
        priority
      />
    </div>
  );
};

export default FeaturedImage;
