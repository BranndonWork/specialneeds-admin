import RotateImages from "@components/Shared/RotateImages";
import { serveAsset } from "@utils/assetHelpers";

const Sidebar = () => {
  const slideshowTimeout = 5 * 1000;

  const slideshowImages = [
    {
      src: serveAsset("specialNeedsNews", 400),
      href: "/articles/?category=news",
      title: "Special Needs News",
      caption: "Special Needs News",
    },
    {
      src: serveAsset("specialNeedsArticles", 400),
      href: "/articles/",
      title: "Special Needs Articles",
      caption: "Special Needs Articles",
    },
    {
      src: serveAsset("specialNeedsTherapists", 400),
      href: "/directory/?category=counseling&sub_category=therapists",
      title: "Special Needs Therapists",
      caption: "Special Needs Therapists",
    },

    {
      src: serveAsset("specialNeedsCamps", 400),
      href: "/directory/?category=recreational-activities&sub_category=camps",
      title: "Special Needs Camps",
      caption: "Special Needs Camps",
    },
    {
      src: serveAsset("specialNeedsSchools", 400),
      href: "/directory/?category=education&sub_category=schools",
      title: "Special Needs Schools",
      caption: "Special Needs Schools",
    },
  ];

  function logger() {
    // console.log("logger", ...arguments);
  }

  return (
    <RotateImages
      logger={logger}
      slideshowTimeout={slideshowTimeout}
      slideshowImages={slideshowImages}
      isRandom={false}
    />
  );
};

export default Sidebar;
