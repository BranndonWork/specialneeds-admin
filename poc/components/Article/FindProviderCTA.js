import Link from "next/link";
import { serveAsset } from "@utils/assetHelpers";

const FindProviderCTA = () => {
  const imageUrl = serveAsset("bannerKids", 600);

  return (
    <div className="widget find-provider-cta">
      <Link
        href="/directory/"
        className="find-provider-cta__card"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="find-provider-cta__overlay">
          <p className="find-provider-cta__eyebrow">SpecialNeeds.com Directory</p>
          <h3 className="find-provider-cta__title">Find Providers Near You</h3>
          <p className="find-provider-cta__sub">Schools · Therapists · Camps</p>
          <span className="find-provider-cta__btn">Search Directory</span>
        </div>
      </Link>
    </div>
  );
};

export default FindProviderCTA;
