import { serveAsset } from "@utils/assetHelpers";
import Image from "next/image";

const Loader = ({ image, style }) => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%",
    ...style,
  };

  image = image || serveAsset("contentLoading");

  return (
    <>
      <div style={containerStyle} className="content-loading">
        <Image
          src={image}
          alt="Page loading animation of 5 colorful dots playfully rotating positions"
          width={200}
          height={100}
        />
      </div>
      <style jsx>{`
        .content-loading :global(img) {
          max-width: 100%;
          max-height: 100%;
        }
      `}</style>
    </>
  );
};

export default Loader;
